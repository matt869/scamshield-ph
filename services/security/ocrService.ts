/**
 * Optional on-device OCR. When a text-recognition native module is present
 * (requires a dev build), we extract text locally so the screenshot itself
 * never has to leave the device — only redacted text is sent to the API.
 * In Expo Go (no native OCR module), this returns null and the app falls
 * back to sending the image to Claude vision with strict PII instructions.
 */

type RecognizeFn = (uri: string) => Promise<{ text: string } | string>;

let recognize: RecognizeFn | null | undefined;

function loadOcrModule(): RecognizeFn | null {
  if (recognize !== undefined) return recognize;
  try {
    // Optional dependency — install @react-native-ml-kit/text-recognition
    // and create a dev build to enable the privacy-preserving OCR path.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@react-native-ml-kit/text-recognition');
    const impl = mod?.default ?? mod;
    recognize = impl?.recognize ? (uri: string) => impl.recognize(uri) : null;
  } catch {
    recognize = null;
  }
  return recognize;
}

export function isOcrAvailable(): boolean {
  return loadOcrModule() !== null;
}

/** Returns extracted text, or null when OCR is unavailable or found nothing. */
export async function extractTextFromImage(uri: string): Promise<string | null> {
  const fn = loadOcrModule();
  if (!fn) return null;
  try {
    const result = await fn(uri);
    const text = typeof result === 'string' ? result : result?.text;
    const trimmed = text?.trim();
    return trimmed && trimmed.length >= 12 ? trimmed : null;
  } catch {
    return null;
  }
}
