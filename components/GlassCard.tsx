import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import GlassView from "./GlassView";
import Colors from "../constants/colors";

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export default function GlassCard({ children, style, testID }: Props) {
  return (
    <GlassView style={[styles.card, style]} testID={testID ?? "glass-card"} intensity={28}>
      {children}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    shadowColor: Colors.palette.glassShadow,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});