import React from 'react';
import { 
  Award, 
  Shield, 
  MailWarning, 
  AlertTriangle, 
  Key, 
  Lock, 
  UserX, 
  Globe, 
  Target, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { IBadge } from '../types';
import { useAuth } from '../context/AuthContext';

interface BadgesPageProps {
  badges: IBadge[];
}

export const BadgesPage: React.FC<BadgesPageProps> = ({ badges }) => {
  const { user } = useAuth();
  const unlockedSet = new Set(user?.badges || []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return Shield;
      case 'MailWarning': return MailWarning;
      case 'AlertTriangle': return AlertTriangle;
      case 'Key': return Key;
      case 'Lock': return Lock;
      case 'UserX': return UserX;
      case 'Globe': return Globe;
      case 'Award': return Award;
      case 'Target': return Target;
      case 'Flame': return Flame;
      default: return Award;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
            ACHIEVEMENT HONORS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cyber Guardian Badges
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Badges unlock automatically when you achieve verified threat defense milestones.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-right">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">UNLOCKED</span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {unlockedSet.size} / {badges.length} Badges
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map(badge => {
          const isUnlocked = unlockedSet.has(badge.id);
          const Icon = getIcon(badge.icon);

          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                isUnlocked
                  ? 'border-amber-500/40 bg-gradient-to-br from-slate-900 to-amber-950/20 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800 bg-slate-900/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      isUnlocked
                        ? 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-md shadow-amber-500/20'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center space-x-1 rounded-full bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  {badge.name}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Requirement: </span>
                {badge.requirement}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
