// src/hooks/useRewardedAd.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from '../constants/adConfig';

export function useRewardedAd(onReward: () => void) {
  const rewardedRef = useRef<RewardedAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onRewardRef = useRef(onReward);
  onRewardRef.current = onReward; // selalu simpan versi terbaru, hindari stale closure

  const loadAd = useCallback(() => {
    const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
    rewardedRef.current = rewarded;
    setIsLoaded(false);

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onRewardRef.current();
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      loadAd(); // preload lagi buat berikutnya
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Rewarded ad failed to load:', error);
      setIsLoaded(false);
    });

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (isLoaded && rewardedRef.current) {
      rewardedRef.current.show();
      return true;
    }
    return false;
  }, [isLoaded]);

  return { showAd, isLoaded };
}