import React from 'react';
import { Shield, Flame, Award, BookOpen, User, BarChart2, Crosshair, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'missions', label: 'Missions', icon: Crosshair },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-sm shadow-blue-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-wider text-white text-sm sm:text-base">CYBER GUARDIAN</span>
                <span className="hidden rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-800/50 sm:inline-block">
                  DEFENSE OPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Learn. Detect. Defend.</p>
            </div>
          </div>

          {/* Nav Items (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Status Bar */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Streak */}
              <div className="flex items-center space-x-1 rounded-full bg-amber-950/40 border border-amber-600/30 px-2 sm:px-2.5 py-1 text-xs text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{user.streak}d</span>
              </div>

              {/* Level & XP */}
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex cursor-pointer items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs hover:border-slate-700 transition"
              >
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-400 leading-tight">LVL {user.level}</div>
                  <div className="text-xs font-bold text-cyan-400 leading-tight">{user.xp} XP</div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950/95 px-2 backdrop-blur-md md:hidden">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 transition-all ${
                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
