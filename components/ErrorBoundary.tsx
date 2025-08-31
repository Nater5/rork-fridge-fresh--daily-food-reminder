import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassCard from "./GlassCard";
import Colors from "@/constants/colors";

type State = { hasError: boolean; message: string | null };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    console.error("ErrorBoundary caught:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { hasError: true, message };
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <GlassCard>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>{this.state.message ?? "Unexpected error"}</Text>
            <TouchableOpacity onPress={this.handleRetry} style={styles.button} testID="retry-button">
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: Colors.light.background },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" as const, marginBottom: 6 },
  subtitle: { color: "rgba(255,255,255,0.85)", marginBottom: 12 },
  button: {
    backgroundColor: Colors.palette.inputBg,
    borderColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "600" as const },
});