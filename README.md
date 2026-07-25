# ScamShield PH 🛡️

Screenshot a suspicious message → get an instant scam verdict. Built for the Philippines: GCash phishing, budol investments, task scams, dugo-dugo, and more.

## How it works

1. **Capture** — tap the big shield right after screenshotting a suspicious message (the app also detects fresh screenshots on foreground), or paste the text.
2. **Protect** — text is sanitized and PII (phones, emails, cards, OTPs) is masked **on-device** before anything is sent. A preview shows exactly what leaves your phone. If an on-device OCR module is installed, even screenshots are converted to redacted text locally.
3. **Analyze** — Claude (`claude-opus-4-8`) classifies the message against a 12-category PH scam taxonomy and returns a structured verdict (schema-enforced JSON): confidence, red flags, immediate actions, and the scammer's predicted next moves.
4. **Act** — the Result screen links to the escalation **Trajectory**, PH **Recovery** hotlines (NBI Cybercrime, PNP ACG, CICC 1326, SEC, DTI, BSP), and a follow-up **chat thread**.

## Run it

```sh
npm install
# put your key in .env:  EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
npx expo start
```

> ⚠️ `EXPO_PUBLIC_` env vars are bundled into the app. That's fine for development; route API calls through a backend proxy before shipping publicly.

## Architecture

```
app/            expo-router screens: index, result, trajectory, recovery, thread, learn
components/     FloatingShazam, ScreenshotPicker, ConfidenceMeter, RedactionPreview
hooks/          useScamAnalysis — capture → OCR/redact → analyze → navigate pipeline
services/
  ai/           claudeService — analysis + follow-up thread (Anthropic SDK)
  security/     redaction (on-device PII masking), ocrService (optional ML Kit)
  platform/     iosScreenshot (latest-screenshot fetch), screenReader (fresh-screenshot detection)
store/          zustand app state (history, current analysis, thread)
constants/      scamTaxonomy (12 PH scam types), systemPrompts, actionGuides (hotlines)
utils/          textSanitizer (zero-width/homoglyph stripping)
```

Optional: install `@react-native-ml-kit/text-recognition` and build a dev client to enable the fully private OCR path where screenshots never leave the device.
