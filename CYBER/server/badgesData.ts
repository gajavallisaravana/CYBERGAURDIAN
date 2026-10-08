export interface IBadge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  category?: string;
  icon: string;
}

export const SEED_BADGES: IBadge[] = [
  {
    id: 'first-mission',
    name: 'First Mission',
    description: 'Completed your very first cybersecurity challenge.',
    requirement: 'Complete 1 challenge successfully',
    icon: 'Shield'
  },
  {
    id: 'phishing-hunter',
    name: 'Phishing Hunter',
    description: 'Mastered identification of deceptive emails and urgent link lures.',
    requirement: 'Complete 3 Phishing challenges',
    category: 'phishing',
    icon: 'MailWarning'
  },
  {
    id: 'scam-detector',
    name: 'Scam Detector',
    description: 'Recognized high-yield financial traps, fake checks, and tech alerts.',
    requirement: 'Complete 3 Scam challenges',
    category: 'scam',
    icon: 'AlertTriangle'
  },
  {
    id: 'password-master',
    name: 'Password Master',
    description: 'Understands passphrase entropy, credential stuffing, and FIDO2 MFA.',
    requirement: 'Complete 3 Password challenges',
    category: 'password',
    icon: 'Key'
  },
  {
    id: 'privacy-protector',
    name: 'Privacy Protector',
    description: 'Guarded personal identities, permission hygiene, and Wi-Fi transit.',
    requirement: 'Complete 3 Privacy challenges',
    category: 'privacy',
    icon: 'Lock'
  },
  {
    id: 'social-engineer-spotter',
    name: 'Social Engineer Spotter',
    description: 'Detected authority pressure, tailgating, and fake recruiters.',
    requirement: 'Complete 3 Social Engineering challenges',
    category: 'social_engineering',
    icon: 'UserX'
  },
  {
    id: 'safe-browser',
    name: 'Safe Browser',
    description: 'Spotted deceptive padlocks, homoglyphs, and malvertising traps.',
    requirement: 'Complete 3 Safe Browsing challenges',
    category: 'safe_browsing',
    icon: 'Globe'
  },
  {
    id: 'cyber-guardian',
    name: 'Cyber Guardian',
    description: 'Ultimate Defender: Tackled threats across all 6 defense categories.',
    requirement: 'Complete at least 1 challenge in every category',
    icon: 'Award'
  },
  {
    id: 'accuracy-ace',
    name: 'Accuracy Ace',
    description: 'Maintained a threat detection accuracy rate above 85%.',
    requirement: 'Reach 85%+ accuracy with at least 5 completed challenges',
    icon: 'Target'
  },
  {
    id: 'streak-champion',
    name: 'Streak Champion',
    description: 'Maintained active threat defense training streak.',
    requirement: 'Complete challenges across consecutive active sessions',
    icon: 'Flame'
  }
];
