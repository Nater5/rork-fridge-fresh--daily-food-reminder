import React, { ReactNode } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import Colors from "../constants/colors";

type Props = ViewProps & { children: ReactNode; intensity?: number };

export default function GlassView({ children, style, intensity = 25, ...rest }: Props) {
  if (Platform.OS === "web") {
    return (
      <View
        {...rest}
        style={[styles.webGlass, style, { ...(Platform.OS === "web" ? ({ backdropFilter: `blur(${intensity}px)` } as any) : {}) }]}
        testID={rest.testID ?? "glass-view"}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={intensity} tint="extraLight" style={[styles.nativeGlass, style]} {...rest} testID={rest.testID ?? "glass-view"}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  nativeGlass: {
    backgroundColor: Colors.palette.glassBg,
    borderColor: Colors.palette.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  webGlass: {
    backgroundColor: Colors.palette.glassBg,
    borderColor: Colors.palette.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
});