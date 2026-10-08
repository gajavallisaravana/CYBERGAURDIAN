import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Shield, School, Flame } from 'lucide-react';
import { api } from '../services/api';
import { ILeaderboardUser } from '../types';
import { useAuth } from '../context/AuthContext';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'global' | 'college'>('global');
  const [leaderboard, setLeaderboard] = useState<ILeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const data = await api.getLeaderboard(tab);
        setLeaderboard(data);
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [tab]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10 pb-24">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
          OPERATIONAL RANKINGS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Defense Leaderboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Top cyber defense operatives ranked by total validated simulation XP.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 mb-6 max-w-xs">
        <button
          onClick={() => setTab('global')}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
            tab === 'global'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Global Defense
        </button>
        <button
          onClick={() => setTab('college')}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
            tab === 'college'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Campus Division
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Fetching active leaderboard metrics...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No rankings recorded yet. Complete your first mission!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {leaderboard.map((item, idx) => {
              const rank = idx + 1;
              const isCurrentUser = user && (item._id === user.id || item.name === user.name);

              return (
                <div
                  key={item._id || idx}
                  className={`flex items-center justify-between p-4 transition ${
                    isCurrentUser
                      ? 'bg-blue-950/40 border-l-4 border-blue-500'
                      : 'hover:bg-slate-850/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* Rank Badge */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center font-mono font-bold text-xs">
                      {rank === 1 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          1
                        </div>
                      ) : rank === 2 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40">
                          2
                        </div>
                      ) : rank === 3 ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-800/20 text-amber-600 border border-amber-700/40">
                          3
                        </div>
                      ) : (
                        <span className="text-slate-500">#{rank}</span>
                      )}
                    </div>

                    {/* Operative Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {item.name}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <School className="h-3 w-3 text-cyan-400" />
                          <span>{item.collegeName || 'National Cyber Institute'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level & XP */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      {item.xp} XP
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Level {item.level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
