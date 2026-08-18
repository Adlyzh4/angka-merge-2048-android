// src/hooks/useInterstitialAd.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from '../constants/adConfig';

export function useInterstitialAd() {
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAd = useCallback(() => {
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
    interstitialRef.current = interstitial;
    setIsLoaded(false);

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      loadAd(); // langsung preload lagi buat sesi berikutnya
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial ad failed to load:', error);
      setIsLoaded(false);
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (isLoaded && interstitialRef.current) {
      interstitialRef.current.show();
    }
  }, [isLoaded]);

  return { showAd, isLoaded };
}