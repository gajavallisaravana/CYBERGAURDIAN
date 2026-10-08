import React, { useState } from 'react';
import { User, Shield, Flame, Award, Target, CheckCircle2, LogOut, Edit2, Save, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { IBadge } from '../types';

interface ProfilePageProps {
  badges: IBadge[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ badges }) => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'shield-cyan');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarOptions = [
    { id: 'shield-cyan', label: 'Cyan Cyber Shield', color: 'from-cyan-500 to-blue-600' },
    { id: 'shield-blue', label: 'Cobalt Sentry', color: 'from-blue-600 to-indigo-700' },
    { id: 'shield-emerald', label: 'Emerald Crypt', color: 'from-emerald-500 to-teal-600' },
    { id: 'shield-purple', label: 'Violet Aegis', color: 'from-purple-500 to-pink-600' },
    { id: 'shield-amber', label: 'Solar Bastion', color: 'from-amber-500 to-orange-600' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile({
        name,
        collegeName,
        avatar: selectedAvatar
      });
      await refreshUser();
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      // Ignore
    } finally {
      setIsSaving(false);
    }
  };

  const unlockedSet = new Set(user?.badges || []);

  const currentAvatarConfig = avatarOptions.find(a => a.id === (user?.avatar || 'shield-cyan')) || avatarOptions[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
            OPERATIVE CREDENTIALS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Guardian Profile
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-1.5 rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Icon */}
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${currentAvatarConfig.color} text-white shadow-xl shadow-blue-500/10 border border-white/20`}
          >
            <Shield className="h-10 w-10 text-white" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Operative Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Campus / Affiliation
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={e => setCollegeName(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Avatar Palette Picker */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Select Avatar Crest
                  </label>
                  <div className="flex items-center space-x-2">
                    {avatarOptions.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedAvatar(opt.id)}
                        className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${opt.color} transition border ${
                          selectedAvatar === opt.id ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                  >
                    <Save className="h-3 w-3" />
                    <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Profile</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                <div className="flex items-center space-x-1 text-xs text-slate-300 mt-1">
                  <School className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{user?.collegeName || 'Cyber Defense Academy'}</span>
                </div>

                {savedSuccess && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Profile updated!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-800/80 text-center">
          <div className="rounded-xl bg-slate-950/70 p-3">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Level</span>
            <span className="text-lg font-bold text-white font-mono">
              L{user?.level || 1}
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Total XP</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">
              {user?.xp || 0}
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Streak</span>
            <span className="text-lg font-bold text-amber-400 font-mono flex items-center justify-center space-x-1">
              <Flame className="h-4 w-4 fill-amber-500" />
              <span>{user?.streak || 1}d</span>
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Accuracy</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {user?.accuracy !== undefined ? user.accuracy : 100}%
            </span>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Unlocked Badges ({unlockedSet.size})</span>
          </h3>
        </div>

        {unlockedSet.size === 0 ? (
          <p className="text-xs text-slate-400">
            No badges unlocked yet. Complete threat missions to earn defense badges.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges
              .filter(b => unlockedSet.has(b.id))
              .map(badge => (
                <div
                  key={badge.id}
                  className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 text-left"
                >
                  <span className="text-xs font-bold text-amber-300 block truncate">
                    {badge.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {badge.requirement}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
