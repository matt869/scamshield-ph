import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisInput, ScamAnalysis, ThreadMessage } from '../../types';
import {
  ANALYSIS_OUTPUT_SCHEMA,
  SCAM_ANALYSIS_SYSTEM_PROMPT,
  threadSystemPrompt,
} from '../../constants/systemPrompts';
import { getCategory } from '../../constants/scamTaxonomy';

const MODEL = 'claude-opus-4-8';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing API key. Set EXPO_PUBLIC_ANTHROPIC_API_KEY in .env and restart the dev server.'
    );
  }
  client = new Anthropic({
    apiKey,
    // The key ships inside the app bundle here, which is fine for a prototype.
    // Before public release, route these calls through a small backend proxy
    // so the key is never on-device.
    dangerouslyAllowBrowser: true,
  });
  return client;
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildUserContent(input: AnalysisInput): Anthropic.ContentBlockParam[] {
  const content: Anthropic.ContentBlockParam[] = [];
  if (input.imageBase64) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: input.imageMediaType ?? 'image/png',
        data: input.imageBase64,
      },
    });
  }
  content.push({
    type: 'text',
    text: input.imageBase64
      ? 'Analyze the message shown in this screenshot for scams.' +
        (input.text ? `\n\nAdditional context from the user:\n${input.text}` : '')
      : `Analyze this message for scams:\n\n${input.text ?? ''}`,
  });
  return content;
}

/**
 * Primary analysis call: screenshot and/or redacted text in, structured
 * ScamAnalysis out. JSON shape is enforced with output_config json_schema.
 */
export async function analyzeForScams(input: AnalysisInput): Promise<ScamAnalysis> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: SCAM_ANALYSIS_SYSTEM_PROMPT,
    output_config: {
      format: {
        type: 'json_schema',
        schema: ANALYSIS_OUTPUT_SCHEMA,
      },
    },
    messages: [{ role: 'user', content: buildUserContent(input) }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('The analysis was declined for safety reasons. Try rephrasing or cropping the screenshot.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('The analysis was cut off. Try a shorter message or a tighter screenshot crop.');
  }

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === 'text'
  );
  if (!textBlock) {
    throw new Error('The model returned no analysis. Please try again.');
  }

  const raw = JSON.parse(textBlock.text) as Omit<ScamAnalysis, 'id' | 'createdAt' | 'sourceType'>;

  // Prefer our taxonomy label when the id resolves, so UI copy stays consistent.
  const category = getCategory(raw.categoryId);

  return {
    id: newId(),
    createdAt: Date.now(),
    sourceType: input.sourceType,
    verdict: raw.verdict,
    confidence: Math.max(0, Math.min(100, Math.round(raw.confidence))),
    categoryId: raw.categoryId,
    categoryLabel: category?.label ?? raw.categoryLabel,
    summary: raw.summary,
    explanation: raw.explanation,
    redFlags: raw.redFlags ?? [],
    recommendedActions: raw.recommendedActions ?? [],
    trajectory: raw.trajectory ?? [],
    extractedText: raw.extractedText || input.text || '',
  };
}

/**
 * Follow-up Q&A thread about a completed analysis.
 * Returns the assistant's reply text.
 */
export async function continueThread(
  analysis: ScamAnalysis,
  history: ThreadMessage[],
  userMessage: string
): Promise<string> {
  const anthropic = getClient();

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m): Anthropic.MessageParam => ({ role: m.role, content: m.text })),
    { role: 'user', content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: threadSystemPrompt(
      JSON.stringify({
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        category: analysis.categoryLabel,
        summary: analysis.summary,
        explanation: analysis.explanation,
        redFlags: analysis.redFlags,
        recommendedActions: analysis.recommendedActions,
        extractedText: analysis.extractedText,
      })
    ),
    messages,
  });

  if (response.stop_reason === 'refusal') {
    return 'Hindi ko masasagot ito — but if you may have been scammed, check the Recovery tab for the hotlines to call right now.';
  }

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === 'text'
  );
  return textBlock?.text ?? 'Sorry, walang sagot na nabuo. Please try again.';
}
