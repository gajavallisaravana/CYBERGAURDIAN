import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import { api } from '../services/api';
import { IChallenge } from '../types';

interface AICoachModalProps {
  currentChallenge?: IChallenge | null;
}

interface Message {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ currentChallenge }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'coach',
      text: 'Greetings, Guardian! I am your tactical AI security coach. Need a hint on your active scenario or a cyber defense rule?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string, userAction?: 'request_hint' | 'explain_threat' | 'safety_tip') => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const reply = await api.askAICoach({
        message: query,
        context: {
          challengeTitle: currentChallenge?.title,
          category: currentChallenge?.category,
          scenarioText: currentChallenge?.scenario?.body,
          difficulty: currentChallenge?.difficulty,
          userAction: userAction || 'general_chat'
        }
      });

      const coachMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'coach',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: 'AI Coach is temporarily unavailable. You can continue the mission.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: 'hint' | 'explain' | 'tip') => {
    if (action === 'hint') {
      const prompt = currentChallenge
        ? `Can you give me a subtle hint for the current challenge "${currentChallenge.title}" without spoiling the answer?`
        : 'Can you give me a general hint for spotting phishing and social engineering?';
      handleSend(prompt, 'request_hint');
    } else if (action === 'explain') {
      const prompt = currentChallenge
        ? `Explain the threat mechanics in this scenario: ${currentChallenge.title}`
        : 'Explain how modern attackers bypass two-factor authentication.';
      handleSend(prompt, 'explain_threat');
    } else if (action === 'tip') {
      handleSend('What is an essential defensive habit I should practice today?', 'safety_tip');
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Cyber Coach"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95 border border-cyan-400/30"
      >
        <div className="relative">
          <Bot className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">AI COACH</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-20 sm:right-6 z-50 w-[90vw] max-w-sm rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Cyber Coach</h4>
                <p className="text-[10px] text-cyan-400 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Tactical Guidance Active</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Action Pills */}
          <div className="mt-3 flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => handleQuickAction('hint')}
              className="flex items-center space-x-1 rounded-full bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 text-blue-300 hover:bg-blue-900/60 transition whitespace-nowrap"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Give me a hint</span>
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              className="flex items-center space-x-1 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 transition whitespace-nowrap"
            >
              <Lightbulb className="h-3 w-3" />
              <span>Explain threat</span>
            </button>
            <button
              onClick={() => handleQuickAction('tip')}
              className="flex items-center space-x-1 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 transition whitespace-nowrap"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Safety tip</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="mt-3 max-h-64 h-52 space-y-2.5 overflow-y-auto pr-1 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-900 text-slate-200 border border-slate-800/80 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1 rounded-xl bg-slate-900 px-3 py-2 text-slate-400 border border-slate-800">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 delay-100"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-3 flex items-center space-x-2 border-t border-slate-800/80 pt-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask coach for guidance..."
              className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
