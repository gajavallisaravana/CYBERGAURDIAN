import React from 'react';
import { Target, Flame, Zap, ShieldCheck, ArrowRight, BarChart2 } from 'lucide-react';
import { IProgressData } from '../types';

interface ProgressPageProps {
  progressData: IProgressData | null;
  onStartMission: (missionId?: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ progressData, onStartMission }) => {
  if (!progressData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-400">
        Loading progress telemetry...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 pb-24">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
          PERFORMANCE TELEMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Your Cyber Progress
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed completion metrics across all operational threat categories.
        </p>
      </div>

      {/* OVERALL COMPLETION CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-white uppercase tracking-wider">
            Overall Completion
          </span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {progressData.overallPercent}%
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
            style={{ width: `${progressData.overallPercent}%` }}
          />
        </div>

        {/* 4 Essential Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center">
          <div className="rounded-xl bg-slate-950/70 p-2.5">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Missions</span>
            <span className="text-base font-bold text-white font-mono">
              {progressData.totalCompleted}/{progressData.totalAvailable}
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-2.5">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Accuracy</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {progressData.accuracy}%
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-2.5">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Level</span>
            <span className="text-base font-bold text-cyan-400 font-mono">
              L{progressData.level}
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-2.5">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Streak</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {progressData.streak}d
            </span>
          </div>
        </div>
      </div>

      {/* SKILLS BREAKDOWN */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-cyan-400" />
          <span>Category Defense Competencies</span>
        </h2>

        <div className="space-y-4">
          {progressData.categoryBreakdown.map(cat => (
            <div key={cat.category}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200">{cat.label}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {cat.completed}/{cat.total} ({cat.percent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED NEXT */}
      <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl shadow-cyan-500/5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
          RECOMMENDED NEXT
        </span>
        <h3 className="text-base font-bold text-white">
          {progressData.recommendedNext.recommendationText}
        </h3>
        {progressData.recommendedNext.challengeTitle && (
          <p className="mt-1 text-xs text-slate-300">
            Next target: <span className="font-semibold text-white">{progressData.recommendedNext.challengeTitle}</span> (+{progressData.recommendedNext.xpReward || 100} XP)
          </p>
        )}

        <button
          onClick={() => onStartMission(progressData.recommendedNext.challengeId)}
          className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-98"
        >
          <span>ENGAGE RECOMMENDED MISSION</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
