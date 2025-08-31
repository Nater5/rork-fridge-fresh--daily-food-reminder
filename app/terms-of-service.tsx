import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';

export default function TermsOfServiceScreen() {
  return (
    <LinearGradient
      colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Terms of Service', headerShown: true }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.contentCard}>
            <Text style={styles.title}>Terms of Service</Text>
            <Text style={styles.lastUpdated}>Last updated: December 26, 2024</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By downloading, installing, or using the Food Sense mobile application, you agree to be 
                bound by these Terms of Service. If you do not agree to these terms, please do not use our app.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Description of Service</Text>
              <Text style={styles.sectionText}>
                Food Sense is a mobile application that helps users track food inventory, monitor expiry dates, 
                and receive recommendations to reduce food waste. The service includes:
              </Text>
              <Text style={styles.bulletPoint}>• Food inventory management</Text>
              <Text style={styles.bulletPoint}>• Expiry date tracking and notifications</Text>
              <Text style={styles.bulletPoint}>• Recipe suggestions based on available ingredients</Text>
              <Text style={styles.bulletPoint}>• Dietary preference management</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. User Accounts</Text>
              <Text style={styles.sectionText}>
                To use certain features of our app, you must create an account. You are responsible for:
              </Text>
              <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account credentials</Text>
              <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
              <Text style={styles.bulletPoint}>• Providing accurate and up-to-date information</Text>
              <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
              <Text style={styles.sectionText}>
                You agree not to use the app to:
              </Text>
              <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
              <Text style={styles.bulletPoint}>• Infringe on the rights of others</Text>
              <Text style={styles.bulletPoint}>• Upload malicious code or attempt to hack the service</Text>
              <Text style={styles.bulletPoint}>• Use the service for commercial purposes without permission</Text>
              <Text style={styles.bulletPoint}>• Share false or misleading information</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Content and Data</Text>
              <Text style={styles.sectionText}>
                You retain ownership of the content you provide to the app. By using our service, you grant us 
                a license to use your data to provide and improve our services. We do not claim ownership of 
                your personal food inventory data.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Health and Safety Disclaimer</Text>
              <Text style={styles.sectionText}>
                Food Sense is designed to help track food inventory and expiry dates, but it should not be 
                your only method for determining food safety. Always use your best judgment and follow proper 
                food safety guidelines. We are not responsible for any health issues that may arise from 
                consuming expired or unsafe food.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Service Availability</Text>
              <Text style={styles.sectionText}>
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted 
                access. We may temporarily suspend the service for maintenance, updates, or other operational reasons.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
              <Text style={styles.sectionText}>
                To the maximum extent permitted by law, Food Sense and its developers shall not be liable for 
                any indirect, incidental, special, or consequential damages arising from your use of the app.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Termination</Text>
              <Text style={styles.sectionText}>
                We may terminate or suspend your account at any time for violation of these terms. You may 
                also delete your account at any time through the app settings.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
              <Text style={styles.sectionText}>
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes through the app or via email. Continued use of the app after changes constitutes 
                acceptance of the new terms.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>11. Governing Law</Text>
              <Text style={styles.sectionText}>
                These terms are governed by and construed in accordance with applicable laws. Any disputes 
                will be resolved through binding arbitration.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>12. Contact Information</Text>
              <Text style={styles.sectionText}>
                If you have any questions about these Terms of Service, please contact us at:
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