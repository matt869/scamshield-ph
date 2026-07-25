/**
 * Text normalization applied before redaction and analysis.
 * Scam messages often carry zero-width characters and homoglyphs used to
 * dodge spam filters; stripping them makes both regex redaction and the
 * model's job more reliable.
 */

const MAX_INPUT_LENGTH = 8000;

/** Invisible characters commonly used to evade keyword filters. */
const ZERO_WIDTH = /[​-‏‪-‮⁠-⁤﻿]/g;

/** A small map of frequent Cyrillic/Greek homoglyphs → Latin. */
const HOMOGLYPHS: Record<string, string> = {
  а: 'a', е: 'e', о: 'o', р: 'p', с: 'c', х: 'x', у: 'y', і: 'i', ѕ: 's',
  А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', Х: 'X',
  ο: 'o', ν: 'v', Α: 'A', Β: 'B', Ε: 'E', Ζ: 'Z', Η: 'H', Ι: 'I', Κ: 'K', Μ: 'M',
  Ν: 'N', Ο: 'O', Ρ: 'P', Τ: 'T', Υ: 'Y', Χ: 'X',
};

export function sanitizeText(raw: string): string {
  let text = raw.normalize('NFKC').replace(ZERO_WIDTH, '');
  text = text.replace(/[Ѐ-ӿͰ-Ͽ]/g, (ch) => HOMOGLYPHS[ch] ?? ch);
  // Collapse runs of whitespace but keep line breaks — message structure matters.
  text = text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (text.length > MAX_INPUT_LENGTH) {
    text = text.slice(0, MAX_INPUT_LENGTH) + '\n[truncated]';
  }
  return text;
}
