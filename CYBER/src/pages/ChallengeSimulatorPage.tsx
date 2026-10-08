import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Globe, 
  Mail, 
  MessageSquare, 
  User, 
  Lock, 
  ExternalLink, 
  Eye, 
  Info, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Zap,
  Target
} from 'lucide-react';
import { IChallenge, IChallengeAnswerResult } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';

interface ChallengeSimulatorPageProps {
  challenge: IChallenge;
  onBackToMissions: () => void;
  onNextChallenge: () => void;
  onLevelUp: (level: number, badges: string[]) => void;
  onBadgeUnlocked?: (badgeName: string) => void;
}

export const ChallengeSimulatorPage: React.FC<ChallengeSimulatorPageProps> = ({
  challenge,
  onBackToMissions,
  onNextChallenge,
  onLevelUp,
  onBadgeUnlocked
}) => {
  const { updateUserLocally } = useAuth();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<IChallengeAnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);

  // Game-style mission entry transition
  const [isDeploying, setIsDeploying] = useState(true);
  const [showXpGain, setShowXpGain] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);

  // Small mission entry sequence
  useEffect(() => {
    setIsDeploying(true);
    setSelectedOptionId(null);
    setResult(null);
    setError(null);
    setShowXpGain(false);
    soundFX.playCommit();

    const timer = setTimeout(() => {
      setIsDeploying(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [challenge.id]);

  const handleSubmitDecision = async () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    soundFX.playCommit();

    try {
      const answerResult = await api.submitAnswer(challenge.id, selectedOptionId);
      setResult(answerResult);

      // Audio feedback based on consequence
      if (answerResult.isCorrect) {
        soundFX.playSuccess();
        setLastEarnedXp(answerResult.xpEarned);
        setShowXpGain(true);
      } else {
        soundFX.playMissed();
      }

      // Update local state for immediate feedback
      updateUserLocally({
        xp: answerResult.newTotalXP,
        level: answerResult.newLevel,
        completedMissions: answerResult.completedMissions
      });

      // Handle newly unlocked badges
      if (answerResult.newBadgesUnlocked && answerResult.newBadgesUnlocked.length > 0) {
        if (onBadgeUnlocked) {
          onBadgeUnlocked(answerResult.newBadgesUnlocked[0]);
        }
      }

      // Handle level up celebration
      if (answerResult.hasLeveledUp) {
        onLevelUp(answerResult.newLevel, answerResult.newBadgesUnlocked);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to submit decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    soundFX.playClick();
    setSelectedOptionId(null);
    setResult(null);
    setError(null);
    setShowInspector(false);
    setShowXpGain(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 pb-28 relative">
      {/* GAME-STYLE MISSION ENTRY TRANSITION OVERLAY */}
      {isDeploying && (
        <div 
          onClick={() => setIsDeploying(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 mb-3 shadow-xl shadow-cyan-500/10 animate-pulse">
            <Zap className="h-7 w-7 text-cyan-400" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-cyan-400">
            LOADING TACTICAL SIMULATION
          </span>
          <h2 className="mt-1 text-lg sm:text-xl font-black text-white text-center px-4">
            {challenge.title}
          </h2>
          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SANDBOX CONNECTED</span>
          </div>
        </div>
      )}

      {/* FLOATING XP GAIN CELEBRATION */}
      {showXpGain && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-white font-black text-sm shadow-xl shadow-cyan-500/30 animate-in zoom-in slide-in-from-bottom-6 duration-300">
          <Sparkles className="h-4 w-4 text-amber-300 animate-spin" />
          <span>+{lastEarnedXp} XP EARNED!</span>
        </div>
      )}

      {/* Top Breadcrumb & Exit */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundFX.playClick();
            onBackToMissions();
          }}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Sectors</span>
        </button>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
          <span>Isolated Simulation</span>
        </span>
      </div>

      {/* Level Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-lg bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold uppercase">
              {challenge.categoryLabel}
            </span>
            <span className="rounded-lg bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
              {challenge.difficulty}
            </span>
          </div>
          <h1 className="mt-1.5 text-xl sm:text-2xl font-extrabold text-white">
            {challenge.title}
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase">REWARD</span>
          <div className="text-sm font-bold text-amber-400 font-mono">
            +{challenge.xpReward} XP
          </div>
        </div>
      </div>

      {/* SCENARIO SIMULATOR CONTAINER (Dark Glass Window) */}
      <div className="glass-card rounded-2xl shadow-2xl overflow-hidden mb-6 border-slate-800">
        {/* Scenario Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            {challenge.scenarioType === 'email' && <Mail className="h-4 w-4 text-cyan-400" />}
            {challenge.scenarioType === 'chat' && <MessageSquare className="h-4 w-4 text-emerald-400" />}
            {challenge.scenarioType === 'browser' && <Globe className="h-4 w-4 text-blue-400" />}
            {challenge.scenarioType === 'profile' && <User className="h-4 w-4 text-purple-400" />}
            {challenge.scenarioType === 'dialog' && <ShieldAlert className="h-4 w-4 text-amber-400" />}
            <span className="font-mono text-[11px] font-semibold uppercase text-slate-300">
              SIMULATED {challenge.scenarioType.toUpperCase()}
            </span>
          </div>

          {/* Interactive URL / Inspector Tooltip Trigger */}
          {challenge.scenario.attachmentOrUrl && (
            <button
              onClick={() => {
                soundFX.playClick();
                setShowInspector(!showInspector);
              }}
              className="flex items-center space-x-1 rounded bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-slate-700 transition active:scale-95"
            >
              <Eye className="h-3 w-3" />
              <span>{showInspector ? 'Hide Link Details' : 'Inspect Destination'}</span>
            </button>
          )}
        </div>

        {/* SCENARIO CONTENT RENDERING */}
        <div className="p-4 sm:p-6 text-sm">
          {/* Email mockup */}
          {challenge.scenarioType === 'email' && (
            <div className="space-y-3 font-sans">
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-slate-400">From:</span>
                  <span className="font-mono text-slate-200 font-medium">
                    {challenge.scenario.sender} &lt;{challenge.scenario.senderAddress}&gt;
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-bold text-white">{challenge.scenario.subject}</span>
                </div>
                {challenge.scenario.timestamp && (
                  <div className="text-[10px] text-slate-400">{challenge.scenario.timestamp}</div>
                )}
              </div>

              <div className="whitespace-pre-line text-slate-200 leading-relaxed pt-2">
                {challenge.scenario.body}
              </div>

              {/* URL Inspection Preview */}
              {challenge.scenario.attachmentOrUrl && (
                <div className="mt-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 p-3 text-xs">
                  <div className="flex items-center justify-between text-amber-300 font-mono mb-1">
                    <span className="font-semibold flex items-center space-x-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Link Target Analysis:</span>
                    </span>
                    <span className="text-[10px] text-amber-400/80 uppercase">Inspection Preview</span>
                  </div>
                  <div className="font-mono text-xs text-amber-200 break-all select-all bg-black/40 p-2 rounded-lg border border-amber-900/50">
                    {challenge.scenario.attachmentOrUrl}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat / SMS mockup */}
          {challenge.scenarioType === 'chat' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                    {challenge.scenario.sender?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{challenge.scenario.sender}</div>
                    <div className="text-[10px] text-slate-400">{challenge.scenario.timestamp}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                  External Messenger
                </span>
              </div>

              <div className="my-2 flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-slate-800/90 border border-slate-700/80 p-3.5 text-slate-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-sm">
                  {challenge.scenario.body}
                </div>
              </div>
            </div>
          )}

          {/* Browser mockup */}
          {challenge.scenarioType === 'browser' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono">
                <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-slate-200">{challenge.scenario.urlDomain}</span>
              </div>

              {challenge.scenario.securityFlags && (
                <div className="flex flex-wrap gap-1.5">
                  {challenge.scenario.securityFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-red-950/60 border border-red-800/60 px-2 py-0.5 text-[10px] font-mono text-red-300 font-bold"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                {challenge.scenario.body}
              </div>
            </div>
          )}

          {/* Profile / Dialog mockups */}
          {(challenge.scenarioType === 'profile' || challenge.scenarioType === 'dialog') && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                {challenge.scenario.body}
              </div>
            </div>
          )}

          {/* Context note */}
          {challenge.scenario.contextNote && (
            <div className="mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400 italic">
              Scenario Context: {challenge.scenario.contextNote}
            </div>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-800 bg-red-950/40 p-3 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* RESULT CONSEQUENCE VIEW:
          Scenario -> Observe -> Choose Action -> Immediate Reaction -> Learn Why -> Reward -> Next */}
      {result ? (
        <div
          className={`glass-card rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mb-6 ${
            result.isCorrect
              ? 'border-emerald-500/50 bg-emerald-950/20'
              : 'border-red-500/50 bg-red-950/20'
          }`}
        >
          {/* Reaction Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-4">
            <div className="flex items-center space-x-3">
              {result.isCorrect ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 shadow-inner">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              )}
              <div>
                <h2
                  className={`text-xl font-black tracking-wide ${
                    result.isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {result.isCorrect ? '✓ THREAT DETECTED' : '⚠ THREAT MISSED'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {result.isCorrect ? '“Good decision, Guardian.”' : '“Look for urgency and suspicious requests.”'}
                </p>
              </div>
            </div>

            {/* Reward Pill */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">REWARD</span>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {result.isCorrect ? `+${result.xpEarned} XP` : '0 XP'}
              </div>
            </div>
          </div>

          {/* SIMULATED CONSEQUENCE */}
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 mb-3">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1 flex items-center space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
              <span>SIMULATED OUTCOME:</span>
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
              {result.consequence}
            </p>
          </div>

          {/* WHAT YOU MISSED (for missed threats) */}
          {!result.isCorrect && result.whatYouMissed && result.whatYouMissed.length > 0 && (
            <div className="rounded-xl bg-slate-950/90 border border-amber-500/30 p-4 mb-3">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-2 font-bold flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-amber-400" />
                <span>WHAT YOU MISSED:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.whatYouMissed.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WHY? SHORT EXPLANATION */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-300 leading-relaxed mb-5">
            <span className="font-bold text-white flex items-center space-x-1.5 mb-1 text-[11px] uppercase tracking-wider text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>WHY?</span>
            </span>
            {result.explanation}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {result.isCorrect ? (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onNextChallenge();
                }}
                className="flex w-full sm:flex-1 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 transition active:scale-98"
              >
                <span>NEXT LEVEL</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleRetry}
                  className="flex w-full sm:w-1/2 items-center justify-center space-x-2 rounded-xl bg-slate-850 border border-slate-700 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700 transition active:scale-98"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>RETRY SCENARIO</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onNextChallenge();
                  }}
                  className="flex w-full sm:w-1/2 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:from-blue-500 hover:to-cyan-500 transition active:scale-98"
                >
                  <span>SKIP TO NEXT</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* DECISION CHOICES SECTION:
           Observe -> Choose an action -> Immediate reaction */
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {challenge.question}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              Choose your defensive move
            </span>
          </div>

          {/* Interactive Choice Cards with Active Feedback */}
          <div className="space-y-2.5">
            {challenge.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedOptionId(option.id);
                  }}
                  className={`glass-panel flex cursor-pointer items-center justify-between rounded-xl p-4 transition-all duration-150 active:scale-[0.99] ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-500/50'
                      : 'hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium leading-relaxed pr-2">
                    {option.text}
                  </span>
                  <div
                    className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500 text-white scale-110 shadow-sm'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Decision Button */}
          <button
            onClick={handleSubmitDecision}
            disabled={!selectedOptionId || isSubmitting}
            className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition active:scale-98"
          >
            <span>{isSubmitting ? 'Evaluating Threat Reaction...' : 'EXECUTE DEFENSIVE ACTION'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
