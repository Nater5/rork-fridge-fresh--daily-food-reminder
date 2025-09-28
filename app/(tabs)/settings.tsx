import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Settings, FileText, Shield, Info, ExternalLink } from 'lucide-react-native';
import Colors from '../../constants/colors';
import GlassCard from '../../components/GlassCard';


export default function SettingsScreen() {
  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  const handleTermsOfService = () => {
    router.push('/terms-of-service');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Food Sense',
      'Food Sense helps you track your food inventory and reduce waste by monitoring expiry dates and suggesting recipes.',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Settings color={Colors.palette.textPrimary} size={32} />
            <Text style={styles.title}>Settings</Text>
          </View>

          <GlassCard style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
              <View style={styles.menuItemLeft}>
                <Shield color={Colors.palette.textPrimary} size={24} />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ExternalLink color={Colors.palette.textSecondary} size={20} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem} onPress={handleTermsOfService}>
              <View style={styles.menuItemLeft}>
                <FileText color={Colors.palette.textPrimary} size={24} />
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </View>
              <ExternalLink color={Colors.palette.textSecondary} size={20} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
              <View style={styles.menuItemLeft}>
                <Info color={Colors.palette.textPrimary} size={24} />
                <Text style={styles.menuItemText}>About</Text>
              </View>
              <ExternalLink color={Colors.palette.textSecondary} size={20} />
            </TouchableOpacity>
          </GlassCard>

          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>Food Sense</Text>
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <Text style={styles.infoText}>Track your food, reduce waste</Text>
          </GlassCard>
        </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginTop: 12,
  },
  menuCard: {
    padding: 0,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    color: Colors.palette.textPrimary,
    marginLeft: 16,
    fontWeight: '600' as const,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  infoCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
});