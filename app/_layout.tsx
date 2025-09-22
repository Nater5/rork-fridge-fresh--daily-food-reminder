import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FoodProvider } from "@/providers/FoodProvider";
import { RecipeProvider } from "@/providers/RecipeProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: "rgba(12,16,36,0.6)" },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#fff",
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="recipes" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-of-service" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.gestureHandler}>
        <View style={styles.bg}>
          <LinearGradient colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <ErrorBoundary>
            <FoodProvider>
              <RecipeProvider>
                <RootLayoutNav />
              </RecipeProvider>
            </FoodProvider>
          </ErrorBoundary>
        </View>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.light.background },
  gestureHandler: { flex: 1 },
});