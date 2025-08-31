import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CATEGORY_COLORS, Category } from "../constants/categories";
import Colors from "../constants/colors";

type Props = { category: Category; testID?: string };

export default function CategoryChip({ category, testID }: Props) {
  const color = CATEGORY_COLORS[category];
  return (
    <View style={[styles.chip, { borderColor: color }]} testID={testID ?? `chip-${category}`}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.text}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: Colors.palette.chipBg,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { color: Colors.light.textSecondary, fontSize: 12, fontWeight: "600" as const },
});