import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FoodProvider } from "@/providers/FoodProvider";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { RecipeProvider } from "@/providers/RecipeProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color={Colors.palette.textPrimary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: "rgba(12,16,36,0.6)" },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#fff",
    }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="edit-profile" options={{ presentation: "modal" }} />
          <Stack.Screen name="privacy-policy" />
          <Stack.Screen name="terms-of-service" />
        </>
      ) : (
        <>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.bg}>
          <LinearGradient colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <ErrorBoundary>
            <AuthProvider>
              <FoodProvider>
                <RecipeProvider>
                  <RootLayoutNav />
                </RecipeProvider>
              </FoodProvider>
            </AuthProvider>
          </ErrorBoundary>
        </View>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.light.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});