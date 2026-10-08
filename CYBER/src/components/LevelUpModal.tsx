import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ShieldAlert, ArrowRight, Zap } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface LevelUpModalProps {
  level: number;
  newBadges?: string[];
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, newBadges = [], onClose }) => {
  useEffect(() => {
    soundFX.playBadgeUnlock();
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-cyan-500/40 bg-slate-950 p-6 text-center shadow-2xl shadow-cyan-500/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
          <Zap className="h-8 w-8 text-cyan-400 fill-cyan-400/30" />
        </div>

        <div className="mt-4">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">Tactical Clearance Granted</span>
          <h2 className="mt-1 text-2xl font-black text-white">LEVEL UP!</h2>
          <p className="mt-1 text-sm font-bold text-blue-400 tracking-wide">CYBER GUARDIAN — LEVEL {level}</p>
          <p className="mt-2 text-xs text-slate-300">
            Your threat recognition speed and situational security decisions have advanced.
          </p>
        </div>

        {/* Badges unlocked */}
        {newBadges.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-left">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
              <Award className="h-4 w-4" />
              <span>Badge Unlocked!</span>
            </div>
            <div className="mt-1 text-xs text-slate-200">
              {newBadges.join(', ')}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-98"
        >
          <span>Continue Defending</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
