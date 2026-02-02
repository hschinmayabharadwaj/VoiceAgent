/**
 * Crisis Detection Utility
 * Detects distress signals in text and provides appropriate resources
 */

export interface CrisisLevel {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  matchedPatterns: string[];
  suggestedAction: string;
}

// Crisis keywords and patterns (case-insensitive)
const CRITICAL_PATTERNS = [
  /\b(suicide|suicidal|kill myself|end my life|want to die|better off dead)\b/i,
  /\b(self.?harm|hurt myself|cutting myself|overdose)\b/i,
  /\b(no reason to live|can't go on|give up on life)\b/i,
  /\b(planning to end|method to die|goodbye forever)\b/i,
];

const HIGH_PATTERNS = [
  /\b(hopeless|no hope|worthless|burden to everyone)\b/i,
  /\b(can't take it anymore|can't cope|falling apart)\b/i,
  /\b(nobody cares|alone in this|no one understands)\b/i,
  /\b(escape from everything|disappear forever)\b/i,
  /\b(hate myself|despise myself|disgusted with myself)\b/i,
];

const MEDIUM_PATTERNS = [
  /\b(depressed|anxiety attack|panic attack|breakdown)\b/i,
  /\b(really struggling|overwhelmed|drowning in)\b/i,
  /\b(can't sleep|nightmares|insomnia)\b/i,
  /\b(losing control|spiraling|rock bottom)\b/i,
  /\b(don't want to be here|tired of everything)\b/i,
];

const LOW_PATTERNS = [
  /\b(stressed|anxious|worried|nervous)\b/i,
  /\b(sad|down|upset|frustrated)\b/i,
  /\b(lonely|isolated|disconnected)\b/i,
  /\b(struggling|difficult time|hard day)\b/i,
];

export const HELPLINES = {
  global: [
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      description: '24/7 crisis support for suicidal thoughts or emotional distress',
      country: 'USA',
      available: '24/7',
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis counseling via text message',
      country: 'USA',
      available: '24/7',
    },
    {
      name: 'National Suicide Prevention Lifeline',
      number: '1-800-273-8255',
      description: 'Suicide prevention and crisis support',
      country: 'USA',
      available: '24/7',
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Substance abuse and mental health services',
      country: 'USA',
      available: '24/7',
    },
  ],
  india: [
    {
      name: 'iCall',
      number: '9152987821',
      description: 'Psychosocial helpline by TISS',
      country: 'India',
      available: 'Mon-Sat, 8am-10pm',
    },
    {
      name: 'Vandrevala Foundation',
      number: '1860-2662-345',
      description: 'Mental health support helpline',
      country: 'India',
      available: '24/7',
    },
    {
      name: 'NIMHANS',
      number: '080-46110007',
      description: 'National Institute of Mental Health helpline',
      country: 'India',
      available: '24/7',
    },
  ],
  uk: [
    {
      name: 'Samaritans',
      number: '116 123',
      description: 'Emotional support for anyone in distress',
      country: 'UK',
      available: '24/7',
    },
    {
      name: 'CALM',
      number: '0800 58 58 58',
      description: 'Campaign Against Living Miserably',
      country: 'UK',
      available: '5pm-midnight',
    },
  ],
};

export function detectCrisisLevel(text: string): CrisisLevel {
  const matchedPatterns: string[] = [];
  
  // Check critical patterns first
  for (const pattern of CRITICAL_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matchedPatterns.push(match[0]);
    }
  }
  
  if (matchedPatterns.length > 0) {
    return {
      level: 'critical',
      confidence: Math.min(0.9 + matchedPatterns.length * 0.02, 1),
      matchedPatterns,
      suggestedAction: 'immediate_helpline',
    };
  }
  
  // Check high-risk patterns
  for (const pattern of HIGH_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matchedPatterns.push(match[0]);
    }
  }
  
  if (matchedPatterns.length > 0) {
    return {
      level: 'high',
      confidence: Math.min(0.7 + matchedPatterns.length * 0.05, 0.95),
      matchedPatterns,
      suggestedAction: 'show_resources',
    };
  }
  
  // Check medium patterns
  for (const pattern of MEDIUM_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matchedPatterns.push(match[0]);
    }
  }
  
  if (matchedPatterns.length > 0) {
    return {
      level: 'medium',
      confidence: Math.min(0.5 + matchedPatterns.length * 0.1, 0.8),
      matchedPatterns,
      suggestedAction: 'offer_support',
    };
  }
  
  // Check low patterns
  for (const pattern of LOW_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matchedPatterns.push(match[0]);
    }
  }
  
  if (matchedPatterns.length > 0) {
    return {
      level: 'low',
      confidence: Math.min(0.3 + matchedPatterns.length * 0.1, 0.6),
      matchedPatterns,
      suggestedAction: 'continue_conversation',
    };
  }
  
  return {
    level: 'none',
    confidence: 1,
    matchedPatterns: [],
    suggestedAction: 'none',
  };
}

export function getHelplinesByCountry(countryCode: string = 'USA') {
  const countryMap: Record<string, keyof typeof HELPLINES> = {
    'US': 'global',
    'USA': 'global',
    'IN': 'india',
    'IND': 'india',
    'GB': 'uk',
    'UK': 'uk',
  };
  
  const key = countryMap[countryCode.toUpperCase()] || 'global';
  return HELPLINES[key];
}

export function formatCrisisMessage(level: CrisisLevel, language: string = 'en'): string {
  const messages: Record<string, Record<string, string>> = {
    en: {
      critical: "I'm concerned about what you've shared. Please reach out to a crisis helpline right now. You're not alone, and help is available 24/7.",
      high: "It sounds like you're going through a really difficult time. I want you to know that support is available. Would you like to see some resources that might help?",
      medium: "I hear that you're struggling. It's okay to feel this way, and it's brave of you to express it. Let's explore some ways to support you.",
      low: "Thank you for sharing how you're feeling. Everyone has tough moments, and I'm here to help you through this.",
    },
    hi: {
      critical: "आपने जो साझा किया है उससे मुझे चिंता है। कृपया अभी एक संकट हेल्पलाइन से संपर्क करें। आप अकेले नहीं हैं।",
      high: "लगता है आप बहुत कठिन समय से गुजर रहे हैं। सहायता उपलब्ध है।",
      medium: "मैं समझता हूं कि आप संघर्ष कर रहे हैं। ऐसा महसूस करना ठीक है।",
      low: "साझा करने के लिए धन्यवाद। मैं आपकी मदद के लिए यहां हूं।",
    },
    es: {
      critical: "Me preocupa lo que has compartido. Por favor, contacta una línea de crisis ahora mismo. No estás solo/a.",
      high: "Parece que estás pasando por un momento muy difícil. Hay apoyo disponible.",
      medium: "Escucho que estás luchando. Está bien sentirse así.",
      low: "Gracias por compartir cómo te sientes. Estoy aquí para ayudarte.",
    },
  };
  
  const langMessages = messages[language] || messages.en;
  return langMessages[level.level] || '';
}
