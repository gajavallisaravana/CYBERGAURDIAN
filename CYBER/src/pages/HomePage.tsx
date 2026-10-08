import React from 'react';
import { Flame, Zap, ArrowRight, Target, Shield, Crosshair, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IChallenge, IProgressData } from '../types';
import { soundFX } from '../utils/soundEffects';

interface HomePageProps {
  onStartChallenge: (challengeId: string) => void;
  onExploreMissions: () => void;
  recommendedChallenge: IChallenge | null;
  progressData: IProgressData | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartChallenge,
  onExploreMissions,
  recommendedChallenge,
  progressData
}) => {
  const { user } = useAuth();

  const levelProgress = user?.levelProgress || {
    currentMin: 0,
    nextMax: 200,
    percent: 30
  };

  const activeMission = recommendedChallenge || {
    id: 'phish-01',
    title: 'Urgent Account Suspension Notice',
    categoryLabel: 'Phishing Hunter',
    difficulty: 'Easy',
    xpReward: 100
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 pb-28">
      {/* 1. WHERE AM I? Clean Tactical Header */}
      <div className="text-left mb-6">
        <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>CYBER GUARDIAN COMMAND</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome Back, {user?.name || 'Guardian'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Learn cybersecurity by playing realistic simulated threat scenarios.
        </p>
      </div>

      {/* 2. CURRENT LEVEL & XP PROGRESSION (Glass Panel) */}
      <div className="glass-card rounded-2xl p-5 shadow-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-base shadow-inner">
              L{user?.level || 1}
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Current Level: Guardian Level {user?.level || 1}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                {user?.xp || 0} Total XP
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-400 font-bold">
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{user?.streak || 1}d Streak</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1.5">
            <span>XP Progress to Level {(user?.level || 1) + 1}</span>
            <span className="text-cyan-400 font-semibold">{levelProgress.percent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${levelProgress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. WHAT SHOULD I DO NEXT? -> CONTINUE MISSION (Focused Game Level Card) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-1.5">
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            <span>CONTINUE MISSION</span>
          </span>
          <button
            onClick={() => {
              soundFX.playClick();
              onExploreMissions();
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition font-medium flex items-center space-x-1"
          >
            <span>All Sectors</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 border-cyan-500/30 shadow-2xl relative overflow-hidden group">
          {/* Subtle top indicator */}
          <div className="flex items-center space-x-2 text-xs mb-2.5">
            <span className="rounded-lg bg-cyan-950/80 border border-cyan-700/50 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 font-bold uppercase">
              {activeMission.categoryLabel}
            </span>
            <span className="rounded-lg bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
              {activeMission.difficulty}
            </span>
            <span className="text-amber-400 font-bold text-xs ml-auto font-mono">
              +{activeMission.xpReward} XP
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {activeMission.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            Inspect the simulated scenario, analyze threat cues, and make the right security decision.
          </p>

          <button
            onClick={() => {
              soundFX.playClick();
              onStartChallenge(activeMission.id);
            }}
            className="mt-5 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/15 transition active:scale-98"
          >
            <span>START MISSION LEVEL</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 4. TODAY'S DEFENSE GOAL (Clean Minimal Box) */}
      <div className="glass-panel rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-slate-300">
          <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Complete 1 scenario today to maintain your training streak.</span>
        </div>
        <button
          onClick={() => {
            soundFX.playClick();
            onExploreMissions();
          }}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold whitespace-nowrap ml-2"
        >
          View Missions →
        </button>
      </div>
    </div>
  );
};
