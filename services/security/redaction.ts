import type { RedactionMatch, RedactionResult } from '../../types';

/**
 * On-device PII redaction, applied BEFORE any text leaves the phone.
 * The message content (what the scammer wrote) is preserved; the user's and
 * other parties' identifiers are masked. Placeholders keep a hint of the
 * original (last digits) so the analysis stays readable.
 */

interface Rule {
  kind: string;
  pattern: RegExp;
  mask: (match: string) => string;
}

const last = (s: string, n: number) => s.replace(/\D/g, '').slice(-n);

const RULES: Rule[] = [
  {
    kind: 'email address',
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    mask: (m) => `[REDACTED-EMAIL ...${m.slice(m.indexOf('@'))}]`,
  },
  {
    // PH mobile numbers: 09171234567, +639171234567, 0917-123-4567, 0917 123 4567
    kind: 'phone number',
    pattern: /(?:\+?63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/g,
    mask: (m) => `[REDACTED-PHONE ..${last(m, 2)}]`,
  },
  {
    // Card numbers: 13-19 digits, allowing space/dash groups
    kind: 'card number',
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    mask: (m) => `[REDACTED-CARD ..${last(m, 4)}]`,
  },
  {
    // Bank account-ish long digit runs (10-12 digits) not caught above
    kind: 'account number',
    pattern: /\b\d{10,12}\b/g,
    mask: (m) => `[REDACTED-ACCOUNT ..${last(m, 2)}]`,
  },
  {
    // OTP codes when labeled: "OTP is 123456", "code: 4832"
    kind: 'one-time code',
    pattern: /\b(?:otp|code|pin|mpin)\b[^\d\n]{0,12}(\d{4,8})\b/gi,
    mask: (m) => m.replace(/\d{4,8}/, '[REDACTED-CODE]'),
  },
];

export function redactPII(text: string): RedactionResult {
  let redacted = text;
  const matches: RedactionMatch[] = [];

  for (const rule of RULES) {
    redacted = redacted.replace(rule.pattern, (m) => {
      // Skip things already masked by an earlier rule.
      if (m.includes('REDACTED')) return m;
      const masked = rule.mask(m);
      matches.push({ kind: rule.kind, masked });
      return masked;
    });
  }

  return { redacted, matches };
}
