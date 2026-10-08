import React from 'react';
import { BookOpen, Search, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WelcomeGuardianProps {
  onStart: () => void;
}

export const WelcomeGuardian: React.FC<WelcomeGuardianProps> = ({ onStart }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-12">
      {/* Background glow */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/90 p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
        {/* Subtle Shield badge */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-md shadow-blue-500/10 mb-4">
          <Shield className="h-7 w-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white">
          WELCOME, GUARDIAN{user?.name ? ` ${user.name.toUpperCase()}` : ''}
        </h1>
        <p className="mt-2 text-sm text-cyan-400 font-medium">
          “Learn to spot threats before they become problems.”
        </p>

        {/* 3 Simple Concepts */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
          {/* LEARN */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-2">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">LEARN</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Understand common cyber threats.
            </p>
          </div>

          {/* DETECT */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mb-2">
              <Search className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">DETECT</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Identify threats through realistic situations.
            </p>
          </div>

          {/* DEFEND */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">DEFEND</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Make safer decisions.
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onStart}
          className="mt-8 flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-98"
        >
          <span>START JOURNEY</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
