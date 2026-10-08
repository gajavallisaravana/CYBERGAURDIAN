import mongoose, { Schema, Document } from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SEED_CHALLENGES } from './challengesData.js';
import { SEED_BADGES } from './badgesData.js';

// --- Mongoose Schemas ---
export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  completedMissions: string[];
  totalAttempts: number;
  correctAttempts: number;
  collegeName: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: 'shield-cyan' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  completedMissions: { type: [String], default: [] },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  collegeName: { type: String, default: 'National Cyber Institute' },
  createdAt: { type: Date, default: Date.now }
});

const ChallengeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  difficulty: { type: String, required: true },
  xpReward: { type: Number, required: true },
  scenarioType: { type: String, required: true },
  scenario: { type: Schema.Types.Mixed, required: true },
  question: { type: String, required: true },
  options: { type: [Schema.Types.Mixed], required: true },
  explanation: { type: String, required: true },
  hint: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProgressSchema = new Schema({
  userId: { type: String, required: true },
  challengeId: { type: String, required: true },
  completed: { type: Boolean, default: true },
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 1 },
  chosenOptionId: { type: String },
  isCorrect: { type: Boolean, default: false },
  consequence: { type: String },
  completedAt: { type: Date, default: Date.now }
});

const BadgeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: String, required: true },
  category: { type: String },
  icon: { type: String, required: true }
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export const ChallengeModel = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);
export const ProgressModel = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
export const BadgeModel = mongoose.models.Badge || mongoose.model('Badge', BadgeSchema);

// --- State and Resilient Store ---
let isMongoConnected = false;

interface IStoreData {
  users: Array<{
    _id: string;
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    avatar: string;
    level: number;
    xp: number;
    streak: number;
    badges: string[];
    completedMissions: string[];
    totalAttempts: number;
    correctAttempts: number;
    collegeName: string;
    createdAt: string;
  }>;
  progress: Array<{
    _id: string;
    userId: string;
    challengeId: string;
    completed: boolean;
    score: number;
    attempts: number;
    chosenOptionId?: string;
    isCorrect: boolean;
    consequence?: string;
    completedAt: string;
  }>;
  challenges: typeof SEED_CHALLENGES;
  badges: typeof SEED_BADGES;
}

const LOCAL_STORE_PATH = path.resolve(process.cwd(), 'server-data.json');

function loadLocalStore(): IStoreData {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.users && parsed.challenges) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[CyberGuardian] Note: creating fresh store file.');
  }

  // Initial seed
  const defaultPasswordHash = bcrypt.hashSync('GuardianPass123!', 10);
  const initialStore: IStoreData = {
    users: [
      {
        _id: 'user-demo-01',
        id: 'user-demo-01',
        name: 'Alex Chen',
        email: 'guardian@cyberdefense.org',
        passwordHash: defaultPasswordHash,
        avatar: 'shield-cyan',
        level: 2,
        xp: 250,
        streak: 3,
        badges: ['first-mission'],
        completedMissions: ['phish-01', 'soc-01'],
        totalAttempts: 2,
        correctAttempts: 2,
        collegeName: 'National Cyber Academy',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'user-demo-02',
        id: 'user-demo-02',
        name: 'Maya Patel',
        email: 'maya@campus.edu',
        passwordHash: defaultPasswordHash,
        avatar: 'shield-blue',
        level: 4,
        xp: 850,
        streak: 5,
        badges: ['first-mission', 'phishing-hunter', 'scam-detector'],
        completedMissions: ['phish-01', 'phish-02', 'phish-03', 'scam-01', 'scam-02', 'scam-03'],
        totalAttempts: 7,
        correctAttempts: 6,
        collegeName: 'Stanford Cyber Lab',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'user-demo-03',
        id: 'user-demo-03',
        name: 'Jordan Rivera',
        email: 'jordan@mit.edu',
        passwordHash: defaultPasswordHash,
        avatar: 'shield-emerald',
        level: 5,
        xp: 1250,
        streak: 7,
        badges: ['first-mission', 'phishing-hunter', 'password-master', 'safe-browser'],
        completedMissions: ['phish-01', 'phish-02', 'pwd-01', 'pwd-02', 'pwd-03', 'browse-01', 'browse-02'],
        totalAttempts: 8,
        correctAttempts: 7,
        collegeName: 'MIT Information Systems',
        createdAt: new Date().toISOString()
      }
    ],
    progress: [
      {
        _id: 'prog-01',
        userId: 'user-demo-01',
        challengeId: 'phish-01',
        completed: true,
        score: 100,
        attempts: 1,
        isCorrect: true,
        completedAt: new Date().toISOString()
      },
      {
        _id: 'prog-02',
        userId: 'user-demo-01',
        challengeId: 'soc-01',
        completed: true,
        score: 150,
        attempts: 1,
        isCorrect: true,
        completedAt: new Date().toISOString()
      }
    ],
    challenges: SEED_CHALLENGES,
    badges: SEED_BADGES
  };

  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    // Ignore write errors in read-only sandbox
  }
  return initialStore;
}

let store: IStoreData = loadLocalStore();

function saveStore() {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    // Ignore write errors
  }
}

// Connect to MongoDB Atlas
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = !uri || uri.includes('<your-') || uri.includes('your_mongodb_connection_string');

  if (uri && uri.trim().length > 0 && !isPlaceholder) {
    try {
      console.log('[CyberGuardian] Attempting connection to MongoDB Atlas...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongoConnected = true;
      console.log('✓ [CyberGuardian] Successfully connected to MongoDB Atlas database.');
      
      // Ensure seed challenges & badges exist in MongoDB
      const count = await ChallengeModel.countDocuments();
      if (count === 0) {
        console.log('[CyberGuardian] Seeding MongoDB with initial challenges...');
        await ChallengeModel.insertMany(SEED_CHALLENGES);
        await BadgeModel.insertMany(SEED_BADGES);
        console.log('✓ [CyberGuardian] Initial challenges & badges seeded into MongoDB.');
      }
      return;
    } catch (err: any) {
      console.warn(`[CyberGuardian] MongoDB connection notice: ${err?.message || 'Host unreachable'}. Running on persistent database storage.`);
      isMongoConnected = false;
    }
  } else {
    console.log('[CyberGuardian] MONGODB_URI contains a placeholder template (<your-cluster> / <your-username>). Initialized with resilient persistent database storage.');
    isMongoConnected = false;
  }
}

// Data Access Layer (DAL) supporting both MongoDB & Persistent Local Store
export const db = {
  isMongoActive: () => isMongoConnected,

  // Users
  async findUserByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      return await UserModel.findOne({ email: cleanEmail }).lean();
    }
    const found = store.users.find(u => u.email.toLowerCase() === cleanEmail);
    return found ? { ...found } : null;
  },

  async findUserById(id: string) {
    if (isMongoConnected) {
      return await UserModel.findById(id).lean();
    }
    const found = store.users.find(u => u._id === id || u.id === id);
    return found ? { ...found } : null;
  },

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    collegeName?: string;
  }) {
    const cleanEmail = userData.email.toLowerCase().trim();
    if (isMongoConnected) {
      const user = new UserModel({
        ...userData,
        email: cleanEmail,
        avatar: 'shield-cyan',
        level: 1,
        xp: 0,
        streak: 1,
        badges: [],
        completedMissions: [],
        totalAttempts: 0,
        correctAttempts: 0,
        collegeName: userData.collegeName || 'Cyber Security Academy'
      });
      await user.save();
      return user.toObject();
    }

    const newUser = {
      _id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: cleanEmail,
      passwordHash: userData.passwordHash,
      avatar: 'shield-cyan',
      level: 1,
      xp: 0,
      streak: 1,
      badges: [] as string[],
      completedMissions: [] as string[],
      totalAttempts: 0,
      correctAttempts: 0,
      collegeName: userData.collegeName || 'Cyber Security Academy',
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    saveStore();
    return newUser;
  },

  async updateUser(id: string, updates: Partial<{
    name: string;
    avatar: string;
    collegeName: string;
    xp: number;
    level: number;
    streak: number;
    badges: string[];
    completedMissions: string[];
    totalAttempts: number;
    correctAttempts: number;
  }>) {
    if (isMongoConnected) {
      return await UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    }
    const index = store.users.findIndex(u => u._id === id || u.id === id);
    if (index !== -1) {
      store.users[index] = { ...store.users[index], ...updates };
      saveStore();
      return store.users[index];
    }
    return null;
  },

  // Challenges
  async getChallenges(filterCategory?: string) {
    if (isMongoConnected) {
      const query = filterCategory ? { category: filterCategory } : {};
      return await ChallengeModel.find(query).lean();
    }
    if (filterCategory) {
      return store.challenges.filter(c => c.category === filterCategory);
    }
    return store.challenges;
  },

  async getChallengeById(id: string) {
    if (isMongoConnected) {
      return await ChallengeModel.findOne({ id }).lean();
    }
    return store.challenges.find(c => c.id === id) || null;
  },

  // Progress
  async getUserProgress(userId: string) {
    if (isMongoConnected) {
      return await ProgressModel.find({ userId }).lean();
    }
    return store.progress.filter(p => p.userId === userId);
  },

  async recordProgress(data: {
    userId: string;
    challengeId: string;
    score: number;
    chosenOptionId: string;
    isCorrect: boolean;
    consequence?: string;
  }) {
    if (isMongoConnected) {
      const existing = await ProgressModel.findOne({
        userId: data.userId,
        challengeId: data.challengeId
      });
      if (existing) {
        existing.attempts += 1;
        existing.score = Math.max(existing.score, data.score);
        existing.isCorrect = existing.isCorrect || data.isCorrect;
        existing.chosenOptionId = data.chosenOptionId;
        existing.consequence = data.consequence;
        existing.completedAt = new Date();
        await existing.save();
        return existing.toObject();
      }
      const prog = new ProgressModel({
        ...data,
        completed: true,
        attempts: 1,
        completedAt: new Date()
      });
      await prog.save();
      return prog.toObject();
    }

    const existingIndex = store.progress.findIndex(
      p => p.userId === data.userId && p.challengeId === data.challengeId
    );
    if (existingIndex !== -1) {
      store.progress[existingIndex].attempts += 1;
      store.progress[existingIndex].score = Math.max(store.progress[existingIndex].score, data.score);
      store.progress[existingIndex].isCorrect = store.progress[existingIndex].isCorrect || data.isCorrect;
      store.progress[existingIndex].chosenOptionId = data.chosenOptionId;
      store.progress[existingIndex].consequence = data.consequence;
      store.progress[existingIndex].completedAt = new Date().toISOString();
      saveStore();
      return store.progress[existingIndex];
    }

    const newProg = {
      _id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      challengeId: data.challengeId,
      completed: true,
      score: data.score,
      attempts: 1,
      chosenOptionId: data.chosenOptionId,
      isCorrect: data.isCorrect,
      consequence: data.consequence,
      completedAt: new Date().toISOString()
    };
    store.progress.push(newProg);
    saveStore();
    return newProg;
  },

  // Badges
  async getBadges() {
    if (isMongoConnected) {
      return await BadgeModel.find().lean();
    }
    return store.badges;
  },

  // Leaderboard
  async getLeaderboard(type: 'global' | 'college' = 'global') {
    if (isMongoConnected) {
      const users = await UserModel.find({}, 'name level xp streak badges completedMissions collegeName')
        .sort({ xp: -1 })
        .limit(20)
        .lean();
      return users;
    }

    // Sort by XP descending
    const sorted = [...store.users]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 20)
      .map(u => ({
        _id: u._id,
        name: u.name,
        level: u.level,
        xp: u.xp,
        streak: u.streak,
        avatar: u.avatar,
        badges: u.badges,
        completedMissions: u.completedMissions,
        collegeName: u.collegeName
      }));

    return sorted;
  }
};
