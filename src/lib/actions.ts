'use server';

import {
    voiceAgent as voiceAgentFlow,
    textToSpeech as textToSpeechFlow,
    speechToText as speechToTextFlow,
    type ConversationInput,
    type TTSInput,
    type STTInput,
} from '@/ai/flows/voice-agent-flow';


export async function voiceAgent(input: ConversationInput) {
    try {
        const response = await voiceAgentFlow(input);
        return response;
    } catch (error) {
        console.error("Error in voice agent flow:", error);
        return { response: "I'm having a little trouble understanding. Could you please say that again?" };
    }
}

export async function textToSpeech(input: TTSInput) {
    try {
        const response = await textToSpeechFlow(input);
        return response;
    } catch (error) {
        console.error("Error in text-to-speech flow:", error);
        return { audioDataUri: "" };
    }
}

export async function speechToText(input: STTInput) {
    try {
        const response = await speechToTextFlow(input);
        return response;
    } catch (error) {
        console.error("Error in speech-to-text flow:", error);
        return { transcript: "" };
    }
}


