import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library/legacy';

/**
 * Fetches the user's most recent screenshot so the "I just screenshotted a
 * scam" flow is one tap. Works on both platforms despite the filename:
 * iOS filters by the screenshot media subtype, Android falls back to the
 * Screenshots album.
 */

export interface LatestScreenshot {
  uri: string;
  /** ms since epoch when the screenshot was taken */
  takenAt: number;
  assetId: string;
}

export async function requestMediaPermission(): Promise<boolean> {
  const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
  if (status === 'granted') return true;
  if (!canAskAgain) return false;
  const request = await MediaLibrary.requestPermissionsAsync();
  return request.status === 'granted';
}

export async function getLatestScreenshot(): Promise<LatestScreenshot | null> {
  const ok = await requestMediaPermission();
  if (!ok) return null;

  let assets: MediaLibrary.Asset[] = [];

  if (Platform.OS === 'ios') {
    const page = await MediaLibrary.getAssetsAsync({
      first: 1,
      mediaType: MediaLibrary.MediaType.photo,
      mediaSubtypes: ['screenshot'],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    assets = page.assets;
  } else {
    const album = await MediaLibrary.getAlbumAsync('Screenshots');
    const page = await MediaLibrary.getAssetsAsync({
      first: 1,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      ...(album ? { album } : {}),
    });
    assets = page.assets;
  }

  const asset = assets[0];
  if (!asset) return null;

  // getAssetsAsync returns ph:// URIs on iOS; resolve to a readable file URI.
  const info = await MediaLibrary.getAssetInfoAsync(asset);
  const uri = info.localUri ?? asset.uri;

  return {
    uri,
    takenAt: asset.creationTime,
    assetId: asset.id,
  };
}
