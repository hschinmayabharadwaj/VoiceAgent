'use server';

/**
 * Enhanced Voice Agent Flow with Suicidal Ideation Detection
 * Integrates ML-based safety detection with empathetic conversation
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

// Define schemas
const ConversationInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  currentInput: z.string().describe("The user's latest voice input, transcribed to text."),
});

const ConversationOutputSchema = z.object({
  response: z.string().describe("The AI's empathetic and supportive response."),
  safetyAlert: z.boolean().describe("Whether a safety concern was detected."),
  riskLevel: z.string().describe("Risk level: safe, moderate, high, critical"),
  immediateIntervention: z.boolean().describe("Whether immediate intervention is needed."),
});

const TTSInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});

const TTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The base64 encoded WAV audio data URI.'),
});

export type ConversationInput = z.infer<typeof ConversationInputSchema> & {
  mlRiskScore?: number;
  mlRiskLevel?: string;
  mlConfidence?: number;
};
export type ConversationOutput = z.infer<typeof ConversationOutputSchema>;
export type TTSInput = z.infer<typeof TTSInputSchema>;
export type TTSOutput = z.infer<typeof TTSOutputSchema>;

// Crisis helplines for immediate intervention
const CRISIS_HELPLINES = {
  india: [
    "Vandrevala Foundation: 9999666555",
    "iCall: 9152987821", 
    "Aasra: 9820466726"
  ],
  us: [
    "National Suicide Prevention Lifeline: 988",
    "Crisis Text Line: Text HOME to 741741"
  ]
};

// Enhanced safety detection with ML model integration
async function detectSuicidalIdeation(
  text: string, 
  mlData?: { riskScore: number; riskLevel: string; confidence: number }
): Promise<{
  riskScore: number;
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  confidence: number;
}> {
  // If ML model data is available, use it as primary source
  if (mlData && mlData.confidence > 0.5) {
    return {
      riskScore: mlData.riskScore,
      riskLevel: mlData.riskLevel as 'safe' | 'moderate' | 'high' | 'critical',
      confidence: mlData.confidence
    };
  }
  
  // Fallback to keyword-based detection
  const criticalKeywords = [
    'kill myself', 'end my life', 'commit suicide', 'want to die',
    'better off dead', 'take my own life', 'end it all'
  ];
  
  const highRiskKeywords = [
    'suicidal', 'hurt myself', 'self harm', 'not worth living',
    'want to disappear', 'pain too much', 'can\'t go on'
  ];
  
  const moderateKeywords = [
    'hopeless', 'worthless', 'burden', 'empty inside',
    'nothing matters', 'why bother', 'give up'
  ];
  
  const textLower = text.toLowerCase();
  
  // Check for critical indicators
  if (criticalKeywords.some(keyword => textLower.includes(keyword))) {
    return { riskScore: 0.9, riskLevel: 'critical', confidence: 0.85 };
  }
  
  // Check for high risk indicators
  if (highRiskKeywords.some(keyword => textLower.includes(keyword))) {
    return { riskScore: 0.7, riskLevel: 'high', confidence: 0.75 };
  }
  
  // Check for moderate risk indicators
  if (moderateKeywords.some(keyword => textLower.includes(keyword))) {
    return { riskScore: 0.4, riskLevel: 'moderate', confidence: 0.65 };
  }
  
  return { riskScore: 0.1, riskLevel: 'safe', confidence: 0.9 };
}

export async function voiceAgent(input: ConversationInput): Promise<ConversationOutput> {
  return enhancedVoiceAgentFlow(input);
}

export async function textToSpeech(input: TTSInput): Promise<TTSOutput> {
  return textToSpeechFlow(input);
}

// Helper function to convert PCM audio data from Gemini to WAV format
async function toWav(pcmData: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({
            channels: 1,
            sampleRate: 24000,
            bitDepth: 16,
        });

        const buffers: Buffer[] = [];
        writer.on('data', (chunk) => buffers.push(chunk));
        writer.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

const enhancedVoiceAgentPrompt = ai.definePrompt({
    name: 'enhancedVoiceAgentPrompt',
    input: { 
      schema: ConversationInputSchema.extend({
        safetyContext: z.object({
          riskLevel: z.string(),
          riskScore: z.number(),
          requiresCrisisResponse: z.boolean()
        })
      })
    },
    output: { schema: ConversationOutputSchema },
    prompt: `You are ManasMitra, a caring and empathetic voice assistant designed to provide mental wellness support with advanced safety detection capabilities.

**SAFETY CONTEXT:**
- Risk Level: {{safetyContext.riskLevel}}
- Risk Score: {{safetyContext.riskScore}}
- Crisis Response Needed: {{safetyContext.requiresCrisisResponse}}

**RESPONSE GUIDELINES:**
{{#if safetyContext.requiresCrisisResponse}}
🚨 **CRISIS MODE ACTIVATED** 🚨
- Express immediate concern and care
- Validate their courage in sharing
- Emphasize that their life has value
- Provide crisis helplines immediately
- Encourage immediate professional help
- Stay with them emotionally but direct to professionals
- Do NOT try to counsel them yourself - connect them to crisis resources

**Crisis Helplines (mention these):**
- Vandrevala Foundation: 9999666555 (India)
- iCall: 9152987821 (India) 
- Aasra: 9820466726 (India)
- National Suicide Prevention Lifeline: 988 (US)
{{else}}
**STANDARD EMPATHETIC RESPONSE:**
- Listen deeply and acknowledge their feelings
- Ask gentle, caring questions to understand more
- Offer encouragement and highlight their strengths
- Suggest healthy coping strategies
- Keep responses conversational (2-3 sentences)
- Be warm, non-judgmental, and supportive
{{/if}}

**Conversation History:**
{{#each history}}
- {{role}}: {{content}}
{{/each}}

**User's current input:** "{{currentInput}}"

**Your empathetic response:**`
});

const enhancedVoiceAgentFlow = ai.defineFlow(
    {
      name: 'enhancedVoiceAgentFlow',
      inputSchema: ConversationInputSchema,
      outputSchema: ConversationOutputSchema,
    },
    async (input) => {
        // 🔍 Enhanced Safety Detection with ML integration
        const mlData = input.mlRiskScore !== undefined ? {
          riskScore: input.mlRiskScore,
          riskLevel: input.mlRiskLevel || 'safe',
          confidence: input.mlConfidence || 0
        } : undefined;
        
        const safetyAnalysis = await detectSuicidalIdeation(input.currentInput, mlData);
        
        // Log ML vs keyword comparison for debugging
        if (mlData) {
          console.log('🤖 ML Risk Analysis:', mlData);
          console.log('🔍 Final Risk Assessment:', safetyAnalysis);
        }
        
        // 🤖 Generate empathetic response with safety context
        const { output } = await enhancedVoiceAgentPrompt({
          history: input.history,
          currentInput: input.currentInput,
          safetyContext: {
            riskLevel: safetyAnalysis.riskLevel,
            riskScore: safetyAnalysis.riskScore,
            requiresCrisisResponse: safetyAnalysis.riskLevel === 'critical' || safetyAnalysis.riskLevel === 'high'
          }
        });
        
        return {
          response: output!.response,
          safetyAlert: safetyAnalysis.riskLevel !== 'safe',
          riskLevel: safetyAnalysis.riskLevel,
          immediateIntervention: safetyAnalysis.riskLevel === 'critical'
        };
    }
);

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('No audio was generated from the TTS model.');
    }
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);
    
    return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`
    };
  }
);