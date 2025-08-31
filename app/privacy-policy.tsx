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
                We collect information you provide directly to us, such as when you create an account, 
                add food items to your inventory, or contact us for support. This may include:
              </Text>
              <Text style={styles.bulletPoint}>• Name and email address</Text>
              <Text style={styles.bulletPoint}>• Food inventory data</Text>
              <Text style={styles.bulletPoint}>• Dietary preferences and restrictions</Text>
              <Text style={styles.bulletPoint}>• Usage data and analytics</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.sectionText}>
                We use the information we collect to:
              </Text>
              <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
              <Text style={styles.bulletPoint}>• Send you expiry notifications</Text>
              <Text style={styles.bulletPoint}>• Provide personalized recipe recommendations</Text>
              <Text style={styles.bulletPoint}>• Improve our app and services</Text>
              <Text style={styles.bulletPoint}>• Communicate with you about updates and support</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Information Sharing</Text>
              <Text style={styles.sectionText}>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information:
              </Text>
              <Text style={styles.bulletPoint}>• With service providers who assist in our operations</Text>
              <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
              <Text style={styles.bulletPoint}>• In connection with a business transfer or merger</Text>
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
              <Text style={styles.sectionTitle}>5. Data Retention</Text>
              <Text style={styles.sectionText}>
                We retain your personal information for as long as necessary to provide our services 
                and fulfill the purposes outlined in this policy, unless a longer retention period 
                is required by law.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Your Rights</Text>
              <Text style={styles.sectionText}>
                You have the right to:
              </Text>
              <Text style={styles.bulletPoint}>• Access your personal information</Text>
              <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
              <Text style={styles.bulletPoint}>• Delete your account and data</Text>
              <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
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
              <Text style={styles.contactText}>support@foodsense.app</Text>
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