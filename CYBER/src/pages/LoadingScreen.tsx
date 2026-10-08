import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [status, setStatus] = useState('INITIALIZING DEFENSE PROTOCOLS...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatus('CALIBRATING THREAT SIMULATOR...');
    }, 600);

    const t2 = setTimeout(() => {
      setStatus('SYSTEM READY');
      setIsReady(true);
    }, 1300);

    const t3 = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
      {/* Background glow */}
      <div className="absolute h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

      {/* Shield scanning animation */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
        <Shield className="h-12 w-12 text-blue-400" />
        {/* Subtle scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="h-1 w-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
        CYBER GUARDIAN
      </h1>
      <p className="mt-1 text-sm font-medium tracking-wide text-cyan-400">
        Learn. Detect. Defend.
      </p>

      {/* Status indicator */}
      <div className="mt-8 flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-mono">
        {isReady ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-bold tracking-widest">{status}</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-300">{status}</span>
          </>
        )}
      </div>

      <button
        onClick={onComplete}
        className="mt-6 text-xs text-slate-400 hover:text-slate-300 underline underline-offset-4 transition"
      >
        Skip intro
      </button>
    </div>
  );
};
