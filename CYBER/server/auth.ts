import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cyber_guardian_jwt_secret_production_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function generateToken(user: { _id?: string; id?: string; email: string; name: string }): string {
  const userId = user._id || user.id;
  return jwt.sign(
    { id: userId, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
    const user = await db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or user not found.' });
    }
    req.user = { id: (user._id || user.id).toString(), email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function calculateLevel(xp: number): number {
  if (xp < 200) return 1;
  if (xp < 500) return 2;
  if (xp < 900) return 3;
  if (xp < 1400) return 4;
  if (xp < 2000) return 5;
  if (xp < 2700) return 6;
  if (xp < 3500) return 7;
  return Math.floor(xp / 500) + 1;
}

export function getNextLevelXP(level: number): { currentMin: number; nextMax: number } {
  const thresholds = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4500, 6000];
  if (level <= 1) return { currentMin: 0, nextMax: 200 };
  if (level < thresholds.length) {
    return {
      currentMin: thresholds[level - 1],
      nextMax: thresholds[level]
    };
  }
  return {
    currentMin: (level - 1) * 500,
    nextMax: level * 500
  };
}

export async function checkAndAwardBadges(user: any): Promise<{ newBadges: string[]; userBadges: string[] }> {
  const currentBadges = new Set<string>((user.badges || []).map((b: any) => String(b)));
  const newlyAwarded: string[] = [];

  const completedIds = user.completedMissions || [];
  const challenges = await db.getChallenges();
  const completedChallenges = challenges.filter(c => completedIds.includes(c.id));

  // Count completed by category
  const categoryCounts: Record<string, number> = {
    phishing: 0,
    social_engineering: 0,
    scam: 0,
    password: 0,
    privacy: 0,
    safe_browsing: 0
  };

  completedChallenges.forEach(c => {
    if (categoryCounts[c.category] !== undefined) {
      categoryCounts[c.category]++;
    }
  });

  // First Mission
  if (completedIds.length >= 1 && !currentBadges.has('first-mission')) {
    newlyAwarded.push('first-mission');
    currentBadges.add('first-mission');
  }

  // Category Badges (>= 3 completed)
  if (categoryCounts.phishing >= 3 && !currentBadges.has('phishing-hunter')) {
    newlyAwarded.push('phishing-hunter');
    currentBadges.add('phishing-hunter');
  }
  if (categoryCounts.scam >= 3 && !currentBadges.has('scam-detector')) {
    newlyAwarded.push('scam-detector');
    currentBadges.add('scam-detector');
  }
  if (categoryCounts.password >= 3 && !currentBadges.has('password-master')) {
    newlyAwarded.push('password-master');
    currentBadges.add('password-master');
  }
  if (categoryCounts.privacy >= 3 && !currentBadges.has('privacy-protector')) {
    newlyAwarded.push('privacy-protector');
    currentBadges.add('privacy-protector');
  }
  if (categoryCounts.social_engineering >= 3 && !currentBadges.has('social-engineer-spotter')) {
    newlyAwarded.push('social-engineer-spotter');
    currentBadges.add('social-engineer-spotter');
  }
  if (categoryCounts.safe_browsing >= 3 && !currentBadges.has('safe-browser')) {
    newlyAwarded.push('safe-browser');
    currentBadges.add('safe-browser');
  }

  // Cyber Guardian (at least 1 in all 6 categories)
  const allCategoriesCovered = Object.values(categoryCounts).every(cnt => cnt >= 1);
  if (allCategoriesCovered && !currentBadges.has('cyber-guardian')) {
    newlyAwarded.push('cyber-guardian');
    currentBadges.add('cyber-guardian');
  }

  // Accuracy Ace (>= 5 attempts and >= 85% accuracy)
  if (user.totalAttempts >= 5) {
    const accuracy = user.correctAttempts / user.totalAttempts;
    if (accuracy >= 0.85 && !currentBadges.has('accuracy-ace')) {
      newlyAwarded.push('accuracy-ace');
      currentBadges.add('accuracy-ace');
    }
  }

  // Streak Champion
  if (user.streak >= 3 && !currentBadges.has('streak-champion')) {
    newlyAwarded.push('streak-champion');
    currentBadges.add('streak-champion');
  }

  return {
    newBadges: newlyAwarded,
    userBadges: Array.from(currentBadges)
  };
}
