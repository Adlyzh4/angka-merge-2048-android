// src/components/BannerAdView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../constants/adConfig';

export function BannerAdView() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
});