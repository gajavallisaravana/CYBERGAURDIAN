import { IUser, IChallenge, IChallengeAnswerResult, IBadge, IProgressData, ILeaderboardUser } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('cg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string; confirmPassword?: string; collegeName?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to create account. Please try again.');
    return json as { token: string; user: IUser; isFirstLogin: boolean };
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Invalid email or password.');
    return json as { token: string; user: IUser; isFirstLogin: boolean };
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to process reset request.');
    return json as { success: boolean; message: string };
  },

  // User Profile
  async getProfile(): Promise<IUser> {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to load profile.');
    return json;
  },

  async updateProfile(updates: { name?: string; avatar?: string; collegeName?: string }): Promise<{ user: IUser }> {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to update profile.');
    return json;
  },

  // Challenges
  async getChallenges(category?: string): Promise<IChallenge[]> {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    const res = await fetch(`${API_BASE}/challenges${query}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to load missions.');
    return json;
  },

  async getChallengeById(id: string): Promise<IChallenge> {
    const res = await fetch(`${API_BASE}/challenges/${id}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Mission not found.');
    return json;
  },

  async submitAnswer(challengeId: string, optionId: string): Promise<IChallengeAnswerResult> {
    const res = await fetch(`${API_BASE}/challenges/${challengeId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ optionId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to submit decision.');
    return json;
  },

  // Progress
  async getProgress(): Promise<IProgressData> {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to load progress.');
    return json;
  },

  // Badges
  async getBadges(): Promise<IBadge[]> {
    const res = await fetch(`${API_BASE}/badges`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to load badges.');
    return json;
  },

  // Leaderboard
  async getLeaderboard(type: 'global' | 'college' = 'global'): Promise<ILeaderboardUser[]> {
    const res = await fetch(`${API_BASE}/leaderboard?type=${type}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to load leaderboard.');
    return json;
  },

  // AI Cyber Coach (Server-side Gemini proxy)
  async askAICoach(params: {
    message: string;
    context?: {
      challengeTitle?: string;
      category?: string;
      scenarioText?: string;
      difficulty?: string;
      userLevel?: number;
      userAction?: 'request_hint' | 'explain_threat' | 'safety_tip' | 'general_chat';
    };
  }): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    });
    const json = await res.json();
    return json.reply || 'AI Coach is temporarily unavailable. You can continue the mission.';
  }
};
