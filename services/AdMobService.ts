import { Platform } from 'react-native';

// AdMob configuration with your actual IDs
const ADMOB_CONFIG = {
  androidAppId: 'ca-app-pub-3412371770843212~9819228152',
  iosAppId: 'ca-app-pub-3412371770843212~9819228152',
  interstitialAdUnitId: Platform.select({
    android: 'ca-app-pub-3412371770843212/8837046873',
    ios: 'ca-app-pub-3412371770843212/8837046873',
    default: 'ca-app-pub-3412371770843212/8837046873'
  })
};

// Import AdMob when available (will work after expo-dev-client setup)
let mobileAds: any = null;
let InterstitialAd: any = null;
let AdEventType: any = null;

try {
  const googleMobileAds = require('react-native-google-mobile-ads');
  mobileAds = googleMobileAds.default;
  InterstitialAd = googleMobileAds.InterstitialAd;
  AdEventType = googleMobileAds.AdEventType;
} catch (error) {
  console.log('AdMob not available - using placeholder mode');
}

class AdMobService {
  private adCounter = 0;
  private readonly adFrequency = 2; // Show ad every 2nd time
  private isAdReady = false;
  private interstitialAd: any = null;

  constructor() {
    this.initializeAds();
  }

  private async initializeAds() {
    try {
      if (mobileAds && Platform.OS !== 'web') {
        // Initialize AdMob
        await mobileAds.initialize();
        
        // Create interstitial ad
        this.interstitialAd = InterstitialAd.createForAdRequest(ADMOB_CONFIG.interstitialAdUnitId!);
        
        // Load the ad
        this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          this.isAdReady = true;
          console.log('Interstitial ad loaded');
        });
        
        this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
          console.error('Interstitial ad error:', error);
          this.isAdReady = false;
        });
        
        this.interstitialAd.load();
        console.log('AdMob initialized successfully');
      } else {
        // Fallback for web or when AdMob is not available
        console.log('AdMob not available - using placeholder mode');
        this.isAdReady = true;
      }
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      this.isAdReady = true; // Allow app to continue
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    this.adCounter++;
    
    // Only show ad every nth time based on frequency
    if (this.adCounter % this.adFrequency !== 0) {
      console.log(`Ad counter: ${this.adCounter}, not showing ad yet`);
      return false;
    }

    try {
      if (Platform.OS === 'web') {
        // For web, show a simple alert (you can replace with actual web ads)
        alert('Ad would show here (web placeholder)');
        return true;
      }

      if (this.interstitialAd && this.isAdReady && mobileAds) {
        // Show real AdMob interstitial ad
        await this.interstitialAd.show();
        
        // Reload ad for next time
        this.isAdReady = false;
        this.interstitialAd.load();
        
        console.log('Interstitial ad shown successfully');
        return true;
      } else {
        // Fallback for development or when ads aren't ready
        console.log('Interstitial ad would show here (placeholder - ad not ready or AdMob not available)');
        return true;
      }
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  shouldShowAd(): boolean {
    return (this.adCounter + 1) % this.adFrequency === 0;
  }

  getAdCounter(): number {
    return this.adCounter;
  }

  resetAdCounter(): void {
    this.adCounter = 0;
  }
}

export const adMobService = new AdMobService();
export default AdMobService;