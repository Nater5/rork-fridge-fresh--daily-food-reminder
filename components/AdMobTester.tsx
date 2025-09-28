import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { adMobService } from '@/services/AdMobService';

interface AdMobTesterProps {
  onAdShown?: () => void;
}

export default function AdMobTester({ onAdShown }: AdMobTesterProps) {
  const [adCounter, setAdCounter] = useState(adMobService.getAdCounter());
  const [lastAdResult, setLastAdResult] = useState<boolean | null>(null);

  const handleShowAd = async () => {
    console.log('Testing AdMob - Current counter:', adMobService.getAdCounter());
    console.log('Should show ad:', adMobService.shouldShowAd());
    
    const result = await adMobService.showInterstitialAd();
    setLastAdResult(result);
    setAdCounter(adMobService.getAdCounter());
    
    if (result) {
      Alert.alert(
        'Ad Test Result', 
        'Ad would have been shown successfully!\n\nIn production, this will show a real AdMob interstitial ad.',
        [{ text: 'OK' }]
      );
      onAdShown?.();
    } else {
      Alert.alert(
        'Ad Test Result', 
        'Ad was not shown (frequency control or error)',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResetCounter = () => {
    adMobService.resetAdCounter();
    setAdCounter(0);
    setLastAdResult(null);
    Alert.alert('Counter Reset', 'Ad counter has been reset to 0');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdMob Testing Panel</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Ad Counter: {adCounter}</Text>
        <Text style={styles.infoText}>
          Next ad will show: {adMobService.shouldShowAd() ? 'YES' : 'NO'}
        </Text>
        <Text style={styles.infoText}>
          Ad Frequency: Every 2nd action
        </Text>
        {lastAdResult !== null && (
          <Text style={[styles.infoText, { color: lastAdResult ? '#4CAF50' : '#FF5722' }]}>
            Last Result: {lastAdResult ? 'Ad Shown' : 'Ad Skipped'}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.testButton} onPress={handleShowAd}>
          <Text style={styles.buttonText}>Test Show Ad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={handleResetCounter}>
          <Text style={styles.buttonText}>Reset Counter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Testing Notes:</Text>
        <Text style={styles.noteText}>• Ads show every 2nd action</Text>
        <Text style={styles.noteText}>• Web shows alert placeholder</Text>
        <Text style={styles.noteText}>• Mobile needs dev build for real ads</Text>
        <Text style={styles.noteText}>• Check console for detailed logs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  noteText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 2,
  },
});