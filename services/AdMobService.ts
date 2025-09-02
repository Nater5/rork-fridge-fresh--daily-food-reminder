import { Platform } from 'react-native';

// AdMob configuration
const ADMOB_CONFIG = {
  // Your actual AdMob IDs from screenshots
  androidAppId: 'ca-app-pub-3412371770843212~9819228152',
  iosAppId: 'ca-app-pub-3412371770843212~9819228152',
  interstitialAdUnitId: Platform.select({
    android: 'ca-app-pub-3412371770843212/8837046873',
    ios: 'ca-app-pub-3412371770843212/8837046873',
    default: 'ca-app-pub-3412371770843212/8837046873'
  })
};

class AdMobService {
  private adCounter = 0;
  private readonly adFrequency = 2; // Show ad every 2nd time
  private isAdReady = false;

  constructor() {
    this.initializeAds();
  }

  private async initializeAds() {
    try {
      // This will be implemented when you upgrade to expo-dev-client
      // For now, we'll use a placeholder system
      console.log('AdMob initialized (placeholder)');
      this.isAdReady = true;
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
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
        alert('Ad would show here (placeholder for web)');
        return true;
      }

      // For mobile in Expo Go, show placeholder
      console.log('Interstitial ad would show here (placeholder)');
      
      // When you upgrade to expo-dev-client, replace this with:
      // const interstitial = InterstitialAd.createForAdRequest(ADMOB_CONFIG.interstitialAdUnitId!);
      // await interstitial.show();
      
      // For now, just log the config to avoid unused variable warning
      console.log('AdMob config ready:', ADMOB_CONFIG.interstitialAdUnitId);
      
      return true;
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