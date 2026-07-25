import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { useAppStore } from '../store/useAppStore';
import { analyzeForScams } from '../services/ai/claudeService';
import { extractTextFromImage } from '../services/security/ocrService';
import { redactPII } from '../services/security/redaction';
import { sanitizeText } from '../utils/textSanitizer';
import type { AnalysisInput, RedactionResult } from '../types';

function mediaTypeFromUri(uri: string): AnalysisInput['imageMediaType'] {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/png';
}

/**
 * Orchestrates the analysis pipeline:
 *   screenshot → (optional on-device OCR) → redact PII → Claude → result screen
 *   pasted text → sanitize → redact PII → Claude → result screen
 */
export function useScamAnalysis() {
  const router = useRouter();
  const { startAnalysis, completeAnalysis, failAnalysis, isAnalyzing } = useAppStore();

  const run = useCallback(
    async (input: AnalysisInput) => {
      startAnalysis();
      try {
        const analysis = await analyzeForScams(input);
        completeAnalysis(analysis);
        router.push('/result');
      } catch (err) {
        failAnalysis(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      }
    },
    [startAnalysis, completeAnalysis, failAnalysis, router]
  );

  /** Analyze pasted text. Returns the redaction result so callers can preview it. */
  const prepareText = useCallback((raw: string): RedactionResult => {
    return redactPII(sanitizeText(raw));
  }, []);

  const analyzeText = useCallback(
    async (redactedText: string) => {
      await run({ text: redactedText, sourceType: 'text' });
    },
    [run]
  );

  /**
   * Analyze a screenshot. Prefers the privacy path: OCR on-device, redact,
   * send text only. Falls back to sending the image when OCR is unavailable.
   */
  const analyzeImage = useCallback(
    async (uri: string, base64?: string) => {
      const ocrText = await extractTextFromImage(uri);
      if (ocrText) {
        const { redacted } = redactPII(sanitizeText(ocrText));
        await run({ text: redacted, sourceType: 'screenshot' });
        return;
      }

      let imageBase64 = base64;
      if (!imageBase64) {
        imageBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      await run({
        imageBase64,
        imageMediaType: mediaTypeFromUri(uri),
        sourceType: 'screenshot',
      });
    },
    [run]
  );

  return { analyzeText, analyzeImage, prepareText, isAnalyzing };
}
