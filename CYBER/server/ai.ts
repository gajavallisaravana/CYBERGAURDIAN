import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return geminiClient;
  } catch (err) {
    console.warn('[CyberGuardian] Gemini client initialization error:', err);
    return null;
  }
}

export interface AICoachRequest {
  message: string;
  context?: {
    challengeTitle?: string;
    category?: string;
    scenarioText?: string;
    difficulty?: string;
    userLevel?: number;
    userAction?: 'request_hint' | 'explain_threat' | 'safety_tip' | 'general_chat';
  };
  chatHistory?: Array<{ role: 'user' | 'assistant'; text: string }>;
}

export async function askAICoach(params: AICoachRequest): Promise<string> {
  const ai = getAIClient();

  // If Gemini API key is missing or offline, provide realistic defensive mentor guidance fallback
  if (!ai) {
    return getOfflineCoachResponse(params);
  }

  try {
    const systemPrompt = `You are the AI Cyber Coach inside the CYBER GUARDIAN cybersecurity training platform.
Your mission is to guide students and employees to think critically and make safer security decisions.
IMPORTANT RULES:
1. NEVER directly give away the correct multiple-choice option (e.g. don't say "Pick Option 3" or "The answer is X").
2. Instead, guide the user to spot red flags: who is the real sender? Look at the domain carefully. Why are they manufacturing panic or urgency? Is this communication typical of official channels?
3. Keep responses concise, supportive, professional, and tactical (2-4 sentences max). No long essays or academic jargon.
4. If the user asks for a safety tip, provide one actionable golden rule for their current scenario.
5. Emphasize: Experience -> Decide -> Consequence -> Understand -> Improve.`;

    let contextInfo = '';
    if (params.context) {
      contextInfo = `\nCurrent User Context:
- Scenario: ${params.context.challengeTitle || 'General Training'}
- Category: ${params.context.category || 'General Security'}
- Scenario Details: ${params.context.scenarioText || 'None'}
- Intent: ${params.context.userAction || 'Guidance'}`;
    }

    const fullPrompt = `${systemPrompt}\n${contextInfo}\n\nUser Question: ${params.message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt
    });

    const reply = response.text?.trim();
    if (reply && reply.length > 0) {
      return reply;
    }
    return getOfflineCoachResponse(params);
  } catch (err) {
    console.warn('[CyberGuardian] Gemini API execution note. Using tactical fallback.');
    return getOfflineCoachResponse(params);
  }
}

function getOfflineCoachResponse(params: AICoachRequest): string {
  const action = params.context?.userAction || 'general_chat';
  const category = params.context?.category?.toLowerCase() || '';

  if (action === 'request_hint') {
    if (category.includes('phish')) {
      return 'Guardian Hint: Inspect the sender address and link ending with a microscope. Are they creating artificial panic so you skip verification?';
    }
    if (category.includes('scam')) {
      return 'Guardian Hint: If an offer or emergency demands gift cards, wire transfers, or sounds too lucrative to be true, it is almost certainly a trap.';
    }
    if (category.includes('social')) {
      return 'Guardian Hint: Social engineers exploit politeness and authority. Ask yourself: would real IT support ever need your private OTP code?';
    }
    if (category.includes('password')) {
      return 'Guardian Hint: Length and randomness beat leetspeak substitutions. Consider multi-word passphrases and hardware-bound MFA.';
    }
    if (category.includes('privacy')) {
      return 'Guardian Hint: Ask yourself what personal data an attacker could piece together from that post or permission list.';
    }
    if (category.includes('brows')) {
      return 'Guardian Hint: Remember that an HTTPS padlock only encrypts traffic—it does NOT mean the website owner is authentic or trustworthy.';
    }
    return 'Guardian Hint: Slow down and evaluate the source independently. What motive does the sender have to pressure your decision?';
  }

  if (action === 'safety_tip') {
    const tips = [
      'Golden Rule: When in doubt, navigate to the official app or website directly—never click the link inside an unsolicited notification.',
      'MFA Rule: A legitimate customer support representative will never ask you to read your 6-digit one-time passcode back to them.',
      'Passphrase Rule: Four random dictionary words strung together (e.g., "Velvet-Bicycle-Galaxy-Pancake") provide far greater entropy than short complex passwords.',
      'Wi-Fi Rule: On public or open Wi-Fi networks, always use an encrypted VPN or switch to mobile personal hotspot tethering.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return 'Stay vigilant, Guardian. Remember to analyze the sender, verify the domain, and think before reacting to sudden urgency.';
}
