import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { connectDB, db } from './server/db.js';
import {
  authMiddleware,
  generateToken,
  AuthRequest,
  calculateLevel,
  getNextLevelXP,
  checkAndAwardBadges
} from './server/auth.js';
import { askAICoach } from './server/ai.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());

// Initialize Database
connectDB();

// --- REST API ENDPOINTS ---

// Database & Backend Health Status
app.get('/api/health/db', async (_req: Request, res: Response) => {
  const isConnected = db.isMongoActive();
  const uri = process.env.MONGODB_URI || '';
  const isPlaceholder = !uri || uri.includes('<your-') || uri.includes('your_mongodb_connection_string');

  res.json({
    backendConnected: true,
    mongoConnected: isConnected,
    mongoUriConfigured: !isPlaceholder,
    databaseMode: isConnected ? 'MongoDB Atlas' : 'Persistent Database Storage',
    mongoUriRedacted: uri ? (isPlaceholder ? 'Placeholder template detected' : uri.replace(/:([^@]+)@/, ':****@')) : 'Not set'
  });
});

// 1. Authentication
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, collegeName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      name,
      email,
      passwordHash,
      collegeName: collegeName || 'Cyber Defense Academy'
    });

    const token = generateToken(user);
    const sanitizedUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      completedMissions: user.completedMissions,
      collegeName: user.collegeName
    };

    return res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: sanitizedUser,
      isFirstLogin: true
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unable to create account. Please try again.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const sanitizedUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      completedMissions: user.completedMissions,
      collegeName: user.collegeName
    };

    return res.json({
      message: 'Login successful.',
      token,
      user: sanitizedUser,
      isFirstLogin: false
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unable to connect. Please try again.' });
  }
});

app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    // Clean simulated reset flow as requested in problem statement
    return res.json({
      success: true,
      message: `A simulated password reset authorization link was generated for ${email}. For demonstration, you may sign in with the demo account or register a new identity.`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to process reset request.' });
  }
});

// 2. User Profile
app.get('/api/user/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const accuracy = user.totalAttempts > 0
      ? Math.round((user.correctAttempts / user.totalAttempts) * 100)
      : 100;

    const levelInfo = getNextLevelXP(user.level);

    return res.json({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges,
      completedMissions: user.completedMissions,
      totalAttempts: user.totalAttempts,
      correctAttempts: user.correctAttempts,
      accuracy,
      collegeName: user.collegeName,
      levelProgress: {
        currentMin: levelInfo.currentMin,
        nextMax: levelInfo.nextMax,
        percent: Math.min(100, Math.max(0, Math.round(((user.xp - levelInfo.currentMin) / (levelInfo.nextMax - levelInfo.currentMin || 1)) * 100)))
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to load profile data.' });
  }
});

app.put('/api/user/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar, collegeName } = req.body;
    const updates: any = {};
    if (name && name.trim()) updates.name = name.trim();
    if (avatar) updates.avatar = avatar;
    if (collegeName) updates.collegeName = collegeName.trim();

    const updated = await db.updateUser(req.user!.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar,
        level: updated.level,
        xp: updated.xp,
        streak: updated.streak,
        badges: updated.badges,
        completedMissions: updated.completedMissions,
        collegeName: updated.collegeName
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to update profile.' });
  }
});

// 3. Challenges
app.get('/api/challenges', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const challenges = await db.getChallenges(category);
    return res.json(challenges);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to retrieve missions.' });
  }
});

app.get('/api/challenges/:id', async (req: Request, res: Response) => {
  try {
    const challenge = await db.getChallengeById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Mission not found.' });
    }
    return res.json(challenge);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to load mission.' });
  }
});

app.post('/api/challenges/:id/answer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const challengeId = req.params.id;
    const { optionId } = req.body;

    const challenge = await db.getChallengeById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Mission not found.' });
    }

    const selectedOption = challenge.options.find((opt: any) => opt.id === optionId);
    if (!selectedOption) {
      return res.status(400).json({ error: 'Invalid choice selected.' });
    }

    const user = await db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isCorrect = selectedOption.isCorrect;
    const isFirstTimeCompletion = isCorrect && !user.completedMissions.includes(challengeId);
    const xpAwarded = isFirstTimeCompletion ? challenge.xpReward : (isCorrect ? Math.round(challenge.xpReward * 0.25) : 0);

    const newXP = user.xp + xpAwarded;
    const oldLevel = user.level;
    const newLevel = calculateLevel(newXP);
    const hasLeveledUp = newLevel > oldLevel;

    const updatedCompletedMissions = isCorrect && !user.completedMissions.includes(challengeId)
      ? [...user.completedMissions, challengeId]
      : user.completedMissions;

    const totalAttempts = user.totalAttempts + 1;
    const correctAttempts = isCorrect ? user.correctAttempts + 1 : user.correctAttempts;

    // Update user record
    await db.updateUser(req.user!.id, {
      xp: newXP,
      level: newLevel,
      completedMissions: updatedCompletedMissions,
      totalAttempts,
      correctAttempts
    });

    // Record progress history
    await db.recordProgress({
      userId: req.user!.id,
      challengeId,
      score: xpAwarded,
      chosenOptionId: optionId,
      isCorrect,
      consequence: selectedOption.consequence
    });

    // Check for newly unlocked badges
    const freshUser = await db.findUserById(req.user!.id);
    const { newBadges, userBadges } = await checkAndAwardBadges(freshUser);
    if (newBadges.length > 0) {
      await db.updateUser(req.user!.id, { badges: userBadges });
    }

    const levelInfo = getNextLevelXP(newLevel);

    return res.json({
      isCorrect,
      consequence: selectedOption.consequence,
      whatYouMissed: selectedOption.whatYouMissed || [],
      explanation: challenge.explanation,
      xpEarned: xpAwarded,
      newTotalXP: newXP,
      oldLevel,
      newLevel,
      hasLeveledUp,
      newBadgesUnlocked: newBadges,
      completedMissions: updatedCompletedMissions,
      levelProgress: {
        currentMin: levelInfo.currentMin,
        nextMax: levelInfo.nextMax,
        percent: Math.min(100, Math.max(0, Math.round(((newXP - levelInfo.currentMin) / (levelInfo.nextMax - levelInfo.currentMin || 1)) * 100)))
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unable to submit decision. Please try again.' });
  }
});

// 4. Progress Breakdown
app.get('/api/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const allChallenges = await db.getChallenges();
    const completedIds = new Set(user.completedMissions || []);

    const categories = [
      { id: 'phishing', label: 'Phishing Hunter' },
      { id: 'social_engineering', label: 'Social Engineering' },
      { id: 'scam', label: 'Scam Detector' },
      { id: 'password', label: 'Password Guardian' },
      { id: 'privacy', label: 'Privacy Defender' },
      { id: 'safe_browsing', label: 'Safe Browsing' }
    ];

    const categoryBreakdown = categories.map(cat => {
      const catChallenges = allChallenges.filter(c => c.category === cat.id);
      const doneCount = catChallenges.filter(c => completedIds.has(c.id)).length;
      const totalCount = catChallenges.length;
      const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
      return {
        category: cat.id,
        label: cat.label,
        completed: doneCount,
        total: totalCount,
        percent
      };
    });

    const totalChallengesCount = allChallenges.length;
    const totalCompletedCount = completedIds.size;
    const overallPercent = totalChallengesCount > 0
      ? Math.round((totalCompletedCount / totalChallengesCount) * 100)
      : 0;

    // Find weakest category for recommendations
    const sortedSkills = [...categoryBreakdown].sort((a, b) => a.percent - b.percent);
    const weakest = sortedSkills[0];
    const recommendedChallenge = allChallenges.find(
      c => c.category === weakest.category && !completedIds.has(c.id)
    ) || allChallenges.find(c => !completedIds.has(c.id)) || allChallenges[0];

    const accuracy = user.totalAttempts > 0
      ? Math.round((user.correctAttempts / user.totalAttempts) * 100)
      : 100;

    return res.json({
      overallPercent,
      totalCompleted: totalCompletedCount,
      totalAvailable: totalChallengesCount,
      accuracy,
      streak: user.streak,
      level: user.level,
      xp: user.xp,
      categoryBreakdown,
      recommendedNext: {
        categoryLabel: weakest.label,
        recommendationText: `Try a ${weakest.label} mission to improve your lowest threat defense rating.`,
        challengeId: recommendedChallenge?.id,
        challengeTitle: recommendedChallenge?.title,
        difficulty: recommendedChallenge?.difficulty,
        xpReward: recommendedChallenge?.xpReward
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to compute progress metrics.' });
  }
});

// 5. Badges
app.get('/api/badges', async (req: Request, res: Response) => {
  try {
    const badges = await db.getBadges();
    return res.json(badges);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to retrieve badges list.' });
  }
});

// 6. Leaderboard
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as 'global' | 'college') || 'global';
    const leaderboard = await db.getLeaderboard(type);
    return res.json(leaderboard);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to load leaderboard.' });
  }
});

// 7. AI Cyber Coach (calls Google Gemini API server-side)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, context, chatHistory } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message prompt required.' });
    }

    const reply = await askAICoach({
      message,
      context,
      chatHistory
    });

    return res.json({ reply });
  } catch (err) {
    return res.json({
      reply: 'AI Coach is temporarily unavailable. You can continue the mission.'
    });
  }
});

// Mount Vite or static build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev mode, mount Vite middleware to serve client
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️  CYBER GUARDIAN Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
