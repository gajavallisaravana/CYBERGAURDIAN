import React, { useEffect } from 'react';
import { Award, ShieldCheck, X } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface BadgeUnlockToastProps {
  badgeName: string;
  onClose: () => void;
}

export const BadgeUnlockToast: React.FC<BadgeUnlockToastProps> = ({ badgeName, onClose }) => {
  useEffect(() => {
    soundFX.playBadgeUnlock();
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [badgeName, onClose]);

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center space-x-3 rounded-2xl border border-amber-500/50 bg-slate-950/95 p-3.5 sm:p-4 text-white shadow-2xl shadow-amber-500/10 backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
        <Award className="h-6 w-6 animate-pulse" />
      </div>

      <div className="flex-1 pr-1">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
          <ShieldCheck className="h-3 w-3" />
          <span>Badge Unlocked</span>
        </div>
        <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
          {badgeName}
        </h4>
        <p className="text-[11px] text-slate-300">
          Achievement recognized in your permanent defense record.
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
