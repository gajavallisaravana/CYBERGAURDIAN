import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AICoachModal } from './components/AICoachModal';
import { LevelUpModal } from './components/LevelUpModal';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { LoadingScreen } from './pages/LoadingScreen';
import { AuthPage } from './pages/AuthPage';
import { WelcomeGuardian } from './pages/WelcomeGuardian';
import { HomePage } from './pages/HomePage';
import { MissionsPage } from './pages/MissionsPage';
import { ChallengeSimulatorPage } from './pages/ChallengeSimulatorPage';
import { LearnPage } from './pages/LearnPage';
import { BadgesPage } from './pages/BadgesPage';
import { ProgressPage } from './pages/ProgressPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { api } from './services/api';
import { IChallenge, IBadge, IProgressData } from './types';

const MainApp: React.FC = () => {
  const { user, token, loading: authLoading, isFirstLogin, setIsFirstLogin, refreshUser } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  // App data caches
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [badges, setBadges] = useState<IBadge[]>([]);
  const [progressData, setProgressData] = useState<IProgressData | null>(null);

  // Level Up Modal State
  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; level: number; badges: string[] }>({
    show: false,
    level: 1,
    badges: []
  });

  // Badge Unlock Toast State
  const [unlockedBadgeToast, setUnlockedBadgeToast] = useState<string | null>(null);

  // Fetch essential challenges and badges once authenticated
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [cList, bList] = await Promise.all([
          api.getChallenges(),
          api.getBadges()
        ]);
        setChallenges(cList);
        setBadges(bList);
      } catch (err) {
        console.warn('Initial data load notice:', err);
      }
    }
    loadData();
  }, [token]);

  // Load progress when tab is progress or home
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'progress' || activeTab === 'home') {
      api.getProgress()
        .then(data => setProgressData(data))
        .catch(() => {});
    }
  }, [token, activeTab]);

  // Handle entry loading animation
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />;
  }

  // Not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-xs font-mono text-cyan-400">
        VERIFYING GUARDIAN SESSION...
      </div>
    );
  }

  if (!user || !token) {
    return <AuthPage />;
  }

  // First Login Welcome Journey
  if (isFirstLogin) {
    return (
      <WelcomeGuardian
        onStart={() => {
          setIsFirstLogin(false);
          setActiveTab('home');
        }}
      />
    );
  }

  // Active Challenge Simulator Experience
  const activeChallenge = activeChallengeId
    ? challenges.find(c => c.id === activeChallengeId) || null
    : null;

  const handleStartChallenge = (challengeId: string) => {
    setActiveChallengeId(challengeId);
    setActiveTab('challenge');
  };

  const handleNextChallenge = () => {
    const currentIndex = challenges.findIndex(c => c.id === activeChallengeId);
    if (currentIndex !== -1 && currentIndex + 1 < challenges.length) {
      setActiveChallengeId(challenges[currentIndex + 1].id);
    } else if (challenges.length > 0) {
      setActiveChallengeId(challenges[0].id);
    } else {
      setActiveChallengeId(null);
      setActiveTab('missions');
    }
  };

  const handleStartCategoryMissions = (category: string) => {
    const matching = challenges.find(c => c.category === category);
    if (matching) {
      setActiveChallengeId(matching.id);
      setActiveTab('challenge');
    } else {
      setActiveTab('missions');
    }
  };

  const recommendedMission = progressData?.recommendedNext?.challengeId
    ? challenges.find(c => c.id === progressData.recommendedNext.challengeId) || challenges[0] || null
    : challenges[0] || null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab === 'challenge' ? 'missions' : activeTab}
        setActiveTab={tab => {
          setActiveChallengeId(null);
          setActiveTab(tab);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'challenge' && activeChallenge ? (
          <ChallengeSimulatorPage
            challenge={activeChallenge}
            onBackToMissions={() => {
              setActiveChallengeId(null);
              setActiveTab('missions');
              refreshUser();
            }}
            onNextChallenge={handleNextChallenge}
            onLevelUp={(lvl, b) => setLevelUpInfo({ show: true, level: lvl, badges: b })}
            onBadgeUnlocked={badge => setUnlockedBadgeToast(badge)}
          />
        ) : activeTab === 'home' ? (
          <HomePage
            onStartChallenge={handleStartChallenge}
            onExploreMissions={() => setActiveTab('missions')}
            recommendedChallenge={recommendedMission}
            progressData={progressData}
          />
        ) : activeTab === 'missions' ? (
          <MissionsPage
            challenges={challenges}
            onSelectChallenge={handleStartChallenge}
          />
        ) : activeTab === 'learn' ? (
          <LearnPage onStartCategoryMissions={handleStartCategoryMissions} />
        ) : activeTab === 'badges' ? (
          <BadgesPage badges={badges} />
        ) : activeTab === 'progress' ? (
          <ProgressPage
            progressData={progressData}
            onStartMission={id => {
              if (id) handleStartChallenge(id);
              else setActiveTab('missions');
            }}
          />
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardPage />
        ) : activeTab === 'profile' ? (
          <ProfilePage badges={badges} />
        ) : (
          <HomePage
            onStartChallenge={handleStartChallenge}
            onExploreMissions={() => setActiveTab('missions')}
            recommendedChallenge={recommendedMission}
            progressData={progressData}
          />
        )}
      </main>

      {/* Floating AI Cyber Coach */}
      <AICoachModal currentChallenge={activeChallenge} />

      {/* Level Up Celebration Modal */}
      {levelUpInfo.show && (
        <LevelUpModal
          level={levelUpInfo.level}
          newBadges={levelUpInfo.badges}
          onClose={() => setLevelUpInfo({ show: false, level: 1, badges: [] })}
        />
      )}

      {/* Badge Unlock Toast */}
      {unlockedBadgeToast && (
        <BadgeUnlockToast
          badgeName={unlockedBadgeToast}
          onClose={() => setUnlockedBadgeToast(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
