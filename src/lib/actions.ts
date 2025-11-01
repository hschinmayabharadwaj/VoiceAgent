'use server';

import {
  generateAffirmation,
  type GenerateAffirmationInput,
} from '@/ai/flows/daily-affirmations';
import {
  empatheticResponseToDailyCheckin,
  type EmpatheticResponseToDailyCheckinInput,
} from '@/ai/flows/empathetic-response-to-daily-checkin';
import {
  contextualResourceRecommendation
} from '@/ai/flows/contextual-resource-recommendation';
import { 
  analyzeStory,
  type AnalyzeStoryInput 
} from '@/ai/flows/story-analysis-flow';
import {
  analyzeChoices,
  type AnalyzeChoicesInput,
  type AnalyzeChoicesOutput,
} from '@/ai/flows/choice-analysis-flow';
import {
    voiceAgent as voiceAgentFlow,
    textToSpeech as textToSpeechFlow,
    type ConversationInput,
    type TTSInput,
} from '@/ai/flows/voice-agent-flow';
import {
    voiceAgent as enhancedVoiceAgentFlow,
    textToSpeech as enhancedTextToSpeechFlow,
    type ConversationInput as EnhancedConversationInput,
    type TTSInput as EnhancedTTSInput,
} from '@/ai/flows/enhanced-voice-agent-flow';
import {
    chat as chatFlow,
    type ChatInput,
    type ChatOutput,
} from '@/ai/flows/chat-flow';


export async function getAffirmation(input: GenerateAffirmationInput) {
  try {
    const { affirmation } = await generateAffirmation(input);
    return affirmation;
  } catch (error) {
    console.error("Failed to generate affirmation:", error);
    // Return a default, uplifting affirmation as a fallback
    return "You have the strength to overcome any challenge. Believe in yourself.";
  }
}

export async function getCheckInResponse(
  input: EmpatheticResponseToDailyCheckinInput & { checkInData: string }
) {
  const { checkInData, ...empatheticInput } = input;

  try {
    const [empatheticResponse, resourceRecommendation] = await Promise.all([
      empatheticResponseToDailyCheckin(empatheticInput),
      contextualResourceRecommendation({ checkInData }),
    ]);
    return {
      response: empatheticResponse.response,
      recommendation: resourceRecommendation.resourceRecommendation,
    };
  } catch (error) {
    console.error("Failed to get check-in response:", error);
    // Also apply a fallback for the check-in response to make it more robust.
    return {
      response: "Thank you for sharing. It takes courage to acknowledge your feelings. Remember to be kind to yourself.",
      recommendation: "Consider trying a simple breathing exercise to help center yourself. You can find some in our Resources section."
    };
  }
}

export async function getStoryAnalysis(input: AnalyzeStoryInput) {
  try {
    const analysis = await analyzeStory(input);
    return analysis;
  } catch (error) {
    console.error("Failed to get story analysis:", error);
    return {
      analysis: "Thank you for sharing your story. It's a wonderful act of creativity to bring a new world to life with your words.",
      identifiedFeeling: "Creative"
    };
  }
}

export async function getChoiceAnalysis(input: AnalyzeChoicesInput): Promise<AnalyzeChoicesOutput> {
    try {
        const analysis = await analyzeChoices(input);
        return analysis;
    } catch (error) {
        console.error("Failed to get choice analysis:", error);
        return {
            tendency: "Reflective",
            analysis: "You took a moment to think through your choices. This shows a thoughtful and reflective approach to situations."
        };
    }
}

// ML Model API Integration
interface MLPrediction {
    risk_score: number;
    risk_level: string;
    confidence: number;
    text: string;
}

async function detectSuicideRisk(text: string): Promise<MLPrediction | null> {
    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const prediction: MLPrediction = await response.json();
        console.log('ML Risk Detection:', prediction);
        return prediction;
    } catch (error) {
        console.error('ML API Error:', error);
        return null;
    }
}

export async function voiceAgent(input: ConversationInput) {
    try {
        // First, check for suicide risk using ML model
        const riskPrediction = await detectSuicideRisk(input.userInput);
        
        // Prepare enhanced input with ML results
        const enhancedInput = {
            ...input,
            mlRiskScore: riskPrediction?.risk_score || 0,
            mlRiskLevel: riskPrediction?.risk_level || 'safe',
            mlConfidence: riskPrediction?.confidence || 0
        };
        
        // Use enhanced voice agent with ML data
        const response = await enhancedVoiceAgentFlow(enhancedInput);
        
        // Add ML prediction data to response
        return {
            ...response,
            mlPrediction: riskPrediction
        };
        
    } catch (error) {
        console.error("Error in enhanced voice agent flow:", error);
        // Fallback to basic voice agent
        try {
            const fallbackResponse = await voiceAgentFlow(input);
            return { 
                ...fallbackResponse, 
                safetyAlert: false, 
                riskLevel: 'safe', 
                immediateIntervention: false,
                mlPrediction: null
            };
        } catch (fallbackError) {
            console.error("Fallback voice agent also failed:", fallbackError);
            return { 
                response: "I'm having a little trouble understanding. Could you please say that again?",
                safetyAlert: false,
                riskLevel: 'safe',
                immediateIntervention: false,
                mlPrediction: null
            };
        }
    }
}

export async function textToSpeech(input: TTSInput) {
    try {
        const response = await textToSpeechFlow(input);
        return response;
    } catch (error) {
        console.error("Error in text-to-speech flow:", error);
        throw new Error("Failed to generate audio.");
    }
}

export async function getChatResponse(input: ChatInput): Promise<ChatOutput> {
    try {
        const response = await chatFlow(input);
        return response;
    } catch (error) {
        console.error("Error in chat flow:", error);
        return { response: "I'm sorry, I'm having a little trouble at the moment. Please try again in a bit." };
    }
}
