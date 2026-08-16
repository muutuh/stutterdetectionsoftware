// AI content generation via OpenRouter, proxied through a Supabase Edge
// Function (supabase/functions/openrouter-proxy) so the OpenRouter key
// stays server-side and is never shipped in the client bundle.

import { supabase } from '../config/supabase.js';

async function callAI(prompt) {
    const { data, error } = await supabase.functions.invoke('openrouter-proxy', {
        body: { prompt },
    });
    if (error) throw new Error(`AI request failed: ${error.message}`);
    return data.content;
}

export async function generateReadingPassage() {
    const topics = [
        'cooking dinner', 'grocery shopping', 'watching a show', 'doing laundry',
        'going to the gym', 'a road trip', 'a lazy Sunday morning', 'catching up with a friend',
        'getting ready for work', 'playing a video game', 'tidying up the apartment',
        'planning a weekend trip', 'having lunch with someone', 'binge-watching a series',
    ];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return callAI(
        `Write exactly 3 sentences about "${topic}" for speech therapy reading practice. ` +
        'Write it as a one-sided dialogue — like someone casually telling a friend about it in person. ' +
        'It should sound naturally spoken, not written. ' +
        'All 3 sentences must connect as one flowing story. Keep each sentence under 12 words. ' +
        'Output ONLY the 3 sentences. No intro, no title, no label, no quotes. Start directly with the first sentence.'
    );
}

export async function generateQAPair() {
    const raw = await callAI(
        'Generate a conversational question and a suggested answer for speech therapy Q&A practice. ' +
        'The question should be open-ended and easy to answer from personal experience. ' +
        'Format exactly as:\nQuestion: [question here]\nAnswer: [1–2 sentence suggested answer here]'
    );
    const qMatch = raw.match(/Question:\s*(.+)/i);
    const aMatch = raw.match(/Answer:\s*(.+)/i);
    return {
        question: qMatch ? qMatch[1].trim() : raw,
        answer: aMatch ? aMatch[1].trim() : '',
    };
}

export async function generateTongueTwister() {
    return callAI(
        'Generate one original, fun tongue twister for speech therapy practice. ' +
        'Make it 1–2 lines long, use alliteration or repetitive sounds. ' +
        'Return only the tongue twister text, nothing else.'
    );
}
