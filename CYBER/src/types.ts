export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  completedMissions: string[];
  totalAttempts?: number;
  correctAttempts?: number;
  accuracy?: number;
  collegeName?: string;
  levelProgress?: {
    currentMin: number;
    nextMax: number;
    percent: number;
  };
}

export interface IChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  consequence: string;
  whatYouMissed?: string[];
}

export interface IChallenge {
  id: string;
  title: string;
  category: 'phishing' | 'social_engineering' | 'scam' | 'password' | 'privacy' | 'safe_browsing';
  categoryLabel: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  scenarioType: 'email' | 'chat' | 'browser' | 'profile' | 'dialog';
  scenario: {
    sender?: string;
    senderAddress?: string;
    subject?: string;
    timestamp?: string;
    body: string;
    attachmentOrUrl?: string;
    urlDomain?: string;
    securityFlags?: string[];
    contextNote?: string;
  };
  question: string;
  options: IChallengeOption[];
  explanation: string;
  hint: string;
}

export interface IChallengeAnswerResult {
  isCorrect: boolean;
  consequence: string;
  whatYouMissed: string[];
  explanation: string;
  xpEarned: number;
  newTotalXP: number;
  oldLevel: number;
  newLevel: number;
  hasLeveledUp: boolean;
  newBadgesUnlocked: string[];
  completedMissions: string[];
  levelProgress: {
    currentMin: number;
    nextMax: number;
    percent: number;
  };
}

export interface IBadge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  category?: string;
  icon: string;
}

export interface ICategoryProgress {
  category: string;
  label: string;
  completed: number;
  total: number;
  percent: number;
}

export interface IProgressData {
  overallPercent: number;
  totalCompleted: number;
  totalAvailable: number;
  accuracy: number;
  streak: number;
  level: number;
  xp: number;
  categoryBreakdown: ICategoryProgress[];
  recommendedNext: {
    categoryLabel: string;
    recommendationText: string;
    challengeId?: string;
    challengeTitle?: string;
    difficulty?: string;
    xpReward?: number;
  };
}

export interface ILeaderboardUser {
  _id?: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  avatar?: string;
  badges?: string[];
  completedMissions?: string[];
  collegeName?: string;
}
