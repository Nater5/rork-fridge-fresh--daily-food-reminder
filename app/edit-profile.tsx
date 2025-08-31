import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { User, Mail, Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';
import { useAuth } from '@/providers/AuthProvider';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <LinearGradient
        colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
        style={styles.container}
      >
        <Stack.Screen options={{ title: 'Edit Profile', headerShown: true }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.notAuthenticatedContainer}>
            <Text style={styles.notAuthenticatedText}>Please sign in to edit your profile</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
      style={styles.container}
    >
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile', 
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={styles.saveButton}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.palette.textPrimary} />
              ) : (
                <Save size={20} color={Colors.palette.textPrimary} />
              )}
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.avatarSection}>
              <View style={styles.profileAvatar}>
                <LinearGradient
                  colors={['#FF6B9D', '#C44569']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.profileAvatarText}>{name.charAt(0).toUpperCase() || 'U'}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.avatarLabel}>Profile Picture</Text>
              <Text style={styles.avatarSubtext}>Tap to change (coming soon)</Text>
            </View>

            <GlassCard style={styles.formCard}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={20} color={Colors.palette.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.palette.textSecondary}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      testID="name-input"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color={Colors.palette.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor={Colors.palette.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      testID="email-input"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.saveButtonLarge, isLoading && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={isLoading}
                  testID="save-button"
                >
                  <LinearGradient
                    colors={['#FF6B9D', '#C44569']}
                    style={styles.saveButtonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={Colors.palette.textPrimary} />
                    ) : (
                      <>
                        <Save size={20} color={Colors.palette.textPrimary} />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>

            <GlassCard style={styles.infoCard}>
              <Text style={styles.infoTitle}>Account Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member since:</Text>
                <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account ID:</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
              </View>
            </GlassCard>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  saveButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  avatarLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 4,
  },
  avatarSubtext: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
  },
  formCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.palette.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.palette.textPrimary,
  },
  saveButtonLarge: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notAuthenticatedText: {
    fontSize: 18,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
});