// src/constants/adConfig.ts
import { TestIds } from 'react-native-google-mobile-ads';

// GANTI __DEV__ check ini nanti pas mau build production sungguhan.
// Selama development, SELALU pakai Test IDs bawaan Google.
const USE_TEST_ADS = true; // ganti manual jadi `false` cuma pas build production final

export const BANNER_AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.BANNER
  : 'ca-app-pub-1868043610140076/4465831919'; // ganti dengan Banner Ad Unit ID 

export const INTERSTITIAL_AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-1868043610140076/2578035175'; // ganti dengan Interstitial Ad Unit ID 

export const REWARDED_AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.REWARDED
  : 'ca-app-pub-1868043610140076/7746601371'; // ganti dengan Rewarded Ad Unit ID