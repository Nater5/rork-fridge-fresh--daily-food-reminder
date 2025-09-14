import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';

export default function PrivacyPolicyScreen() {
  return (
    <LinearGradient
      colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Privacy Policy', headerShown: true }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.contentCard}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last updated: December 26, 2024</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.sectionText}>
                This app stores all data locally on your device. We do not require accounts or collect personal information. 
                The only data stored includes:
              </Text>
              <Text style={styles.bulletPoint}>• Food inventory items you add</Text>
              <Text style={styles.bulletPoint}>• Recipes you save</Text>
              <Text style={styles.bulletPoint}>• App preferences</Text>
              <Text style={styles.bulletPoint}>• All data stays on your device</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Advertisements</Text>
              <Text style={styles.sectionText}>
                This app displays ads through Google AdMob. AdMob may collect:
              </Text>
              <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
              <Text style={styles.bulletPoint}>• Ad interaction data</Text>
              <Text style={styles.bulletPoint}>• General location (country/region)</Text>
              <Text style={styles.sectionText}>
                For more details, see Google's Privacy Policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. AI Recipe Generation</Text>
              <Text style={styles.sectionText}>
                When you use the AI recipe feature, your selected ingredients are sent to our AI service 
                to generate recipes. We do not store this data or link it to any user identity.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Data Security</Text>
              <Text style={styles.sectionText}>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Your Data Control</Text>
              <Text style={styles.sectionText}>
                Since all app data is stored locally on your device, you have complete control. 
                Uninstalling the app will permanently delete all your data. You can also clear 
                data through your device settings.
              </Text>
            </View>



            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Children&apos;s Privacy</Text>
              <Text style={styles.sectionText}>
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
              <Text style={styles.sectionText}>
                We may update this privacy policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Contact Us</Text>
              <Text style={styles.sectionText}>
                If you have any questions about this privacy policy, please contact us at:
              </Text>
              <Text style={styles.contactText}>Contact through app store listing</Text>
            </View>
          </GlassCard>
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
    paddingHorizontal: 20,
  },
  contentCard: {
    padding: 24,
    borderRadius: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 16,
    color: Colors.palette.textPrimary,
    fontWeight: '600' as const,
    marginTop: 8,
  },
});