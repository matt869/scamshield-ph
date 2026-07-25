import { AppState, type AppStateStatus } from 'react-native';
import { getLatestScreenshot, type LatestScreenshot } from './iosScreenshot';

/**
 * Detects "the user just took a screenshot and switched to us" — the core
 * Shazam-style flow. When the app returns to the foreground we check whether
 * a new screenshot appeared in the last few minutes and, if so, offer it.
 */

const FRESHNESS_WINDOW_MS = 3 * 60 * 1000;

type Listener = (screenshot: LatestScreenshot) => void;

let lastSeenAssetId: string | null = null;

export function subscribeToFreshScreenshots(onFresh: Listener): () => void {
  const check = async () => {
    try {
      const shot = await getLatestScreenshot();
      if (!shot) return;
      const isFresh = Date.now() - shot.takenAt < FRESHNESS_WINDOW_MS;
      const isNew = shot.assetId !== lastSeenAssetId;
      if (isFresh && isNew) {
        lastSeenAssetId = shot.assetId;
        onFresh(shot);
      }
    } catch {
      // Permission denied or media library unavailable — stay quiet.
    }
  };

  const onChange = (state: AppStateStatus) => {
    if (state === 'active') void check();
  };

  const sub = AppState.addEventListener('change', onChange);
  // Also check once on mount, covering cold starts right after a screenshot.
  void check();

  return () => sub.remove();
}

/** Mark a screenshot as handled so we don't re-offer it. */
export function markScreenshotSeen(assetId: string): void {
  lastSeenAssetId = assetId;
}
