export type Verdict = 'scam' | 'suspicious' | 'safe';

export type SourceType = 'screenshot' | 'text';

export interface TrajectoryStep {
  /** Order in the predicted escalation, starting at 1 */
  stage: number;
  /** Short title, e.g. "They will ask for your OTP" */
  title: string;
  /** What the scammer is likely to do or ask next */
  description: string;
  /** Rough timeframe, e.g. "within minutes", "in the next few days" */
  timeframe: string;
}

export interface ScamAnalysis {
  id: string;
  createdAt: number;
  sourceType: SourceType;
  verdict: Verdict;
  /** 0-100, how confident the model is in the verdict */
  confidence: number;
  /** Taxonomy id, e.g. "gcash_phishing" — "unknown" if no category fits */
  categoryId: string;
  /** Human-readable category label */
  categoryLabel: string;
  /** One-sentence plain-language summary */
  summary: string;
  /** Longer explanation of why this verdict was reached */
  explanation: string;
  /** Specific red flags spotted in the message */
  redFlags: string[];
  /** What the user should do right now */
  recommendedActions: string[];
  /** Predicted next steps if the user keeps engaging */
  trajectory: TrajectoryStep[];
  /** Text extracted from the screenshot (or the pasted text), post-redaction */
  extractedText: string;
}

export interface AnalysisInput {
  /** Redacted/sanitized text to analyze (pasted text or OCR output) */
  text?: string;
  /** Base64 image data (no data: prefix) when analyzing a screenshot directly */
  imageBase64?: string;
  imageMediaType?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
  sourceType: SourceType;
}

export interface ThreadMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface RedactionMatch {
  /** What kind of PII was masked, e.g. "phone number" */
  kind: string;
  /** The masked replacement that now appears in the text */
  masked: string;
}

export interface RedactionResult {
  redacted: string;
  matches: RedactionMatch[];
}

export interface ScamCategory {
  id: string;
  label: string;
  /** Common local names, e.g. "budol" */
  aliases: string[];
  description: string;
  /** Where this scam usually arrives */
  channels: string[];
  /** Typical warning signs to teach users */
  warningSigns: string[];
  /** A realistic (fabricated) example message */
  example: string;
}

export interface Hotline {
  name: string;
  /** Phone, SMS number, or URL */
  contact: string;
  note?: string;
}

export interface ActionGuide {
  id: string;
  title: string;
  /** Which taxonomy category ids this guide applies to; empty = general */
  appliesTo: string[];
  steps: string[];
  hotlines: Hotline[];
}
