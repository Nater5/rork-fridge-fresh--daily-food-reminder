import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { ChefHat, Package, Clock, Sparkles } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';
import { useAuth } from '@/providers/AuthProvider';

const ONBOARDING_KEY = 'has_seen_onboarding';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(seen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  // Show loading while checking auth and onboarding status
  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient 
          colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} 
          style={StyleSheet.absoluteFill} 
        />
      </View>
    );
  }

  // If user is authenticated, redirect to main app
  if (isAuthenticated) {
    return <Redirect href="/today" />;
  }

  // If user has seen onboarding, redirect to login
  if (hasSeenOnboarding) {
    return <Redirect href="/login" />;
  }

  // Show onboarding screen
  return (
    <LinearGradient
      colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <ChefHat size={48} color={Colors.palette.textPrimary} />
            </View>
            <Text style={styles.title}>Food Sense</Text>
            <Text style={styles.subtitle}>Your Smart Kitchen Companion</Text>
          </View>

          <View style={styles.features}>
            <GlassCard style={styles.featureCard}>
              <Package size={32} color={Colors.palette.textPrimary} />
              <Text style={styles.featureTitle}>Track Your Food</Text>
              <Text style={styles.featureDescription}>
                Keep track of all your food items and their expiry dates
              </Text>
            </GlassCard>

            <GlassCard style={styles.featureCard}>
              <Clock size={32} color={Colors.palette.textPrimary} />
              <Text style={styles.featureTitle}>Smart Reminders</Text>
              <Text style={styles.featureDescription}>
                Get notified before your food expires to reduce waste
              </Text>
            </GlassCard>

            <GlassCard style={styles.featureCard}>
              <Sparkles size={32} color={Colors.palette.textPrimary} />
              <Text style={styles.featureTitle}>AI Recipe Ideas</Text>
              <Text style={styles.featureDescription}>
                Get personalized recipe suggestions based on your ingredients
              </Text>
            </GlassCard>
          </View>

          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={completeOnboarding}
          >
            <LinearGradient
              colors={['#FF6B9D', '#C44569']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
  },
  features: {
    gap: 20,
    paddingVertical: 40,
  },
  featureCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  getStartedButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
});