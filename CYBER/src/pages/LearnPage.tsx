import React from 'react';
import { Mail, MessageSquare, AlertTriangle, Key, Lock, Globe, ArrowRight } from 'lucide-react';

interface LearnPageProps {
  onStartCategoryMissions: (category: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onStartCategoryMissions }) => {
  const modules = [
    {
      category: 'phishing',
      title: 'PHISHING',
      tagline: 'Deceptive emails and spoofed notifications',
      icon: Mail,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      whatToNotice: [
        'Unexpected messages concerning sudden account locks',
        'Artificial urgency ("Verify within 2 hours")',
        'Mismatched domain names (e.g., paypaI with capital I instead of l)',
        'Unverified external senders claiming to be security staff'
      ],
      staySafe: [
        'Always verify independently via the official app or website directly',
        'Never click links received unexpectedly in emails or SMS',
        'Flag and report suspicious messages to your security team'
      ]
    },
    {
      category: 'social_engineering',
      title: 'SOCIAL ENGINEERING',
      tagline: 'Psychological manipulation and impersonation',
      icon: MessageSquare,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      whatToNotice: [
        'Callers or messagers claiming authority (CEO, IT Director)',
        'Pressure to bypass standard corporate procurement or badge protocols',
        'Requests for confidential one-time passwords (OTPs)',
        'Tailgating strangers asking you to hold secure access doors'
      ],
      staySafe: [
        'Never read SMS 2FA authentication codes to anyone, including IT support',
        'Verify unusual executive requests through secondary internal chat',
        'Politely direct unbadged visitors to the physical reception desk'
      ]
    },
    {
      category: 'scam',
      title: 'SCAM DETECTION',
      tagline: 'High-yield traps, fake checks, and scareware alerts',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      whatToNotice: [
        'Guaranteed high-yield investment returns with "zero risk"',
        'Requests to wire back money after depositing a stranger’s check',
        'Micro-fees ($1.85) to deliver mystery packages via SMS',
        'Loud browser popup alerts with phone numbers claiming system viruses'
      ],
      staySafe: [
        'Remember: zero-risk investment returns are mathematically impossible',
        'Checks take weeks to truly clear—never refund unverified funds',
        'Close freeze-up browser alerts via Task Manager without calling numbers'
      ]
    },
    {
      category: 'password',
      title: 'PASSWORD GUARDIAN',
      tagline: 'Passphrase entropy, credential stuffing, and modern MFA',
      icon: Key,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      whatToNotice: [
        'Reusing the same password across gaming forums, email, and banking',
        'Short passwords with predictable character replacements (P@ssw0rd1)',
        'MFA push fatigue bombardment (dozens of notifications at 3 AM)',
        'Storing plaintext credentials on sticky notes or "passwords.txt"'
      ],
      staySafe: [
        'Use long passphrases with 4+ random words (Velvet-Bicycle-Galaxy-Pancake)',
        'Store unique credentials in an end-to-end encrypted password manager',
        'Enable hardware security keys (FIDO2/WebAuthn) for critical accounts'
      ]
    },
    {
      category: 'privacy',
      title: 'PRIVACY DEFENDER',
      tagline: 'Oversharing, permission hygiene, and public network safety',
      icon: Lock,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      whatToNotice: [
        'Photos of airline boarding passes exposing 6-letter PNR booking codes',
        'Simple utility apps demanding Contacts, SMS, and Location permissions',
        'Social media quizzes asking for childhood street or mother’s maiden name',
        'Open, unencrypted public Wi-Fi networks in airports and cafes'
      ],
      staySafe: [
        'Practice least privilege: deny unnecessary mobile app permissions',
        'Never answer viral questions that mirror bank account security questions',
        'Use a VPN or cellular phone hotspot when on public Wi-Fi'
      ]
    },
    {
      category: 'safe_browsing',
      title: 'SAFE BROWSING',
      tagline: 'Domain homoglyphs, misleading ads, and certificate myths',
      icon: Globe,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      whatToNotice: [
        'Believing the green padlock proves a website is safe (scammers use SSL too!)',
        'Homoglyphs and typosquatting (e.g., appIe.com with uppercase I)',
        'Websites prompting you to download "Chrome_Setup_Update.exe" to play video',
        'Deceptive flashing green "DOWNLOAD" banner ads disguised as tool buttons'
      ],
      staySafe: [
        'Read the domain from right to left before the first slash',
        'Download software only from official vendor websites or GitHub',
        'Remember that real browsers update silently inside browser settings'
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 pb-24">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
          SECURITY CONCEPTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Tactical Cyber Knowledge
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review core threat indicators and actionable defense rules, then test your reflexes in missions.
        </p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {modules.map(mod => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.category}
              className="glass-card flex flex-col justify-between rounded-2xl p-5 shadow-xl transition hover:border-cyan-500/40"
            >
              <div>
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.bgColor} ${mod.borderColor} border ${mod.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">
                      {mod.title}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {mod.tagline}
                    </p>
                  </div>
                </div>

                {/* What to notice */}
                <div className="mt-4 rounded-xl bg-slate-950/70 border border-slate-800/80 p-3.5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5">
                    WHAT TO NOTICE
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {mod.whatToNotice.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stay safe */}
                <div className="mt-3 rounded-xl bg-slate-950/70 border border-slate-800/80 p-3.5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1.5">
                    STAY SAFE
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {mod.staySafe.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* TEST YOURSELF CTA */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onStartCategoryMissions(mod.category)}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-cyan-500/40 py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:from-blue-600 hover:to-cyan-600 hover:text-white transition active:scale-98 shadow-sm"
                >
                  <span>TEST YOURSELF IN SECTOR</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
