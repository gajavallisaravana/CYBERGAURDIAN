import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Play, 
  RotateCcw,
  Target,
  Sparkles,
  ShieldAlert,
  Mail,
  MessageSquare,
  AlertTriangle,
  Key,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { IChallenge } from '../types';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';

interface MissionsPageProps {
  challenges: IChallenge[];
  onSelectChallenge: (id: string) => void;
}

export type MissionState = 'completed' | 'current' | 'locked';

export const MissionsPage: React.FC<MissionsPageProps> = ({ challenges, onSelectChallenge }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Sectors', icon: Target },
    { id: 'phishing', label: 'Phishing Sector', icon: Mail },
    { id: 'social_engineering', label: 'Social Engineering Matrix', icon: MessageSquare },
    { id: 'scam', label: 'Scam Detection Zone', icon: AlertTriangle },
    { id: 'password', label: 'Password Vault', icon: Key },
    { id: 'privacy', label: 'Privacy Grid', icon: ShieldCheck },
    { id: 'safe_browsing', label: 'Safe Browsing Network', icon: Globe }
  ];

  const completedIds = new Set(user?.completedMissions || []);

  // Group challenges by category to preserve sequential ordering
  const challengesByCategory: Record<string, IChallenge[]> = {};
  challenges.forEach(c => {
    if (!challengesByCategory[c.category]) {
      challengesByCategory[c.category] = [];
    }
    challengesByCategory[c.category].push(c);
  });

  // Determine state of each mission (Completed, Current, Locked)
  const getMissionState = (mission: IChallenge, indexInCategory: number, categoryMissions: IChallenge[]): MissionState => {
    if (completedIds.has(mission.id)) {
      return 'completed';
    }

    // First mission in category is current if not completed
    if (indexInCategory === 0) {
      return 'current';
    }

    // Previous mission in category must be completed to unlock
    const prevMission = categoryMissions[indexInCategory - 1];
    if (prevMission && completedIds.has(prevMission.id)) {
      return 'current';
    }

    return 'locked';
  };

  const filtered = selectedCategory === 'all'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  const totalMissions = challenges.length;
  const totalCompleted = completedIds.size;
  const percentComplete = totalMissions > 0 ? Math.round((totalCompleted / totalMissions) * 100) : 0;

  // Selected category specific progress
  const currentCategoryChallenges = selectedCategory === 'all' 
    ? challenges 
    : (challengesByCategory[selectedCategory] || []);
  const currentCategoryCompleted = currentCategoryChallenges.filter(c => completedIds.has(c.id)).length;
  const currentCategoryTotal = currentCategoryChallenges.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 pb-28">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>OPERATIONAL SECTORS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cyber Threat Missions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Each mission is a simulated real-world threat level. Observe the clues, decide your action, and advance.
          </p>
        </div>

        {/* MISSION PROGRESSION TRACKER */}
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 text-xs min-w-[230px] border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-slate-400 uppercase font-semibold">Total Cleared</span>
            <span className="text-cyan-400 font-bold">{totalCompleted} / {totalMissions} ({percentComplete}%)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>{totalCompleted} Completed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block" />
              <span>{totalMissions - totalCompleted} Remaining</span>
            </span>
          </div>
        </div>
      </div>

      {/* Cyber Sector Selector (Game Zones) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 font-medium whitespace-nowrap transition active:scale-95 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'glass-panel text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Sector Header when specific category is chosen */}
      {selectedCategory !== 'all' && (
        <div className="mb-6 glass-panel rounded-xl px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300">
              Sector Clearance: <strong className="text-white">{currentCategoryCompleted} of {currentCategoryTotal} Levels</strong> completed
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            {currentCategoryTotal > 0 ? Math.round((currentCategoryCompleted / currentCategoryTotal) * 100) : 0}% Complete
          </span>
        </div>
      )}

      {/* GAME LEVEL CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(mission => {
          const categoryList = challengesByCategory[mission.category] || [];
          const indexInCat = categoryList.findIndex(c => c.id === mission.id);
          const state = getMissionState(mission, indexInCat, categoryList);

          const isCompleted = state === 'completed';
          const isCurrent = state === 'current';
          const isLocked = state === 'locked';

          const levelNum = String(indexInCat + 1).padStart(2, '0');

          return (
            <div
              key={mission.id}
              className={`flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 relative overflow-hidden ${
                isCompleted
                  ? 'glass-card border-emerald-500/30'
                  : isCurrent
                  ? 'glass-card border-cyan-500/50 shadow-xl shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                  : 'glass-card border-slate-800/80 opacity-65'
              }`}
            >
              <div>
                {/* Level & Status Header */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-black text-cyan-400 tracking-wider">
                      LEVEL {levelNum}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {mission.difficulty}
                    </span>
                  </div>

                  {/* Status Pill */}
                  {isCompleted ? (
                    <span className="flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>COMPLETED</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center space-x-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>CURRENT</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                      <Lock className="h-3 w-3" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {/* Mission Title */}
                <h3 className="text-sm font-bold text-white leading-snug">
                  {mission.title}
                </h3>

                {/* Objective */}
                <div className="mt-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 p-2.5 text-xs text-slate-300">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                    OBJECTIVE:
                  </span>
                  <p className="line-clamp-2 leading-relaxed text-slate-300">
                    {mission.scenario.contextNote || 'Inspect the incoming message and determine the safest course of action.'}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  +{mission.xpReward} XP
                </span>

                <button
                  disabled={isLocked}
                  onClick={() => {
                    soundFX.playClick();
                    onSelectChallenge(mission.id);
                  }}
                  className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                    isCompleted
                      ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                      : isCurrent
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <RotateCcw className="h-3 w-3" />
                      <span>Replay Level</span>
                    </>
                  ) : isCurrent ? (
                    <>
                      <span>START LEVEL</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
