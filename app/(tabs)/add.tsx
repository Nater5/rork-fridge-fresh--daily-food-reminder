import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "@/constants/colors";
import GlassCard from "@/components/GlassCard";
import { CATEGORIES, Category } from "@/constants/categories";
import { toISODate, isValidISODate } from "@/utils/date";
import { useFood } from "@/providers/FoodProvider";

type FormState = {
  name: string;
  quantity: string;
  unit: string;
  expiryISO: string;
  category: Category;
};

export default function AddScreen() {
  const { addItem } = useFood();
  const today = useMemo(() => toISODate(new Date()), []);

  const [form, setForm] = useState<FormState>({
    name: "",
    quantity: "",
    unit: "pcs",
    expiryISO: today,
    category: "Vegetable",
  });

  const onSubmit = () => {
    try {
      const qty = Number(form.quantity);
      if (!form.name.trim()) {
        Alert.alert("Validation", "Enter a name");
        return;
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        Alert.alert("Validation", "Quantity must be a positive number");
        return;
      }
      if (!isValidISODate(form.expiryISO)) {
        Alert.alert("Validation", "Expiry must be YYYY-MM-DD");
        return;
      }
      addItem({
        name: form.name.trim(),
        quantity: qty,
        unit: form.unit.trim() || "pcs",
        expiryISO: form.expiryISO,
        category: form.category,
      });
      Alert.alert("Added", `${form.name} saved`);
      setForm({ name: "", quantity: "", unit: "pcs", expiryISO: today, category: "Vegetable" });
    } catch (e) {
      console.error("Add submit error", e);
      Alert.alert("Error", "Failed to add item");
    }
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: "Add item", headerTransparent: true }} />
      <LinearGradient colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <GlassCard>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
              placeholder="e.g., Milk"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              testID="name-input"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  value={form.quantity}
                  onChangeText={(t) => setForm((s) => ({ ...s, quantity: t }))}
                  placeholder="e.g., 1"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  inputMode="decimal"
                  keyboardType={Platform.select({ ios: "decimal-pad", android: "decimal-pad", default: "decimal-pad" })}
                  testID="quantity-input"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  value={form.unit}
                  onChangeText={(t) => setForm((s) => ({ ...s, unit: t }))}
                  placeholder="e.g., L, pcs, g"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  testID="unit-input"
                />
              </View>
            </View>

            <Text style={styles.label}>Expiry date (YYYY-MM-DD)</Text>
            <TextInput
              value={form.expiryISO}
              onChangeText={(t) => setForm((s) => ({ ...s, expiryISO: t }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              inputMode="numeric"
              testID="expiry-input"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.catWrap}>
              {CATEGORIES.map((c) => {
                const selected = c === form.category;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setForm((s) => ({ ...s, category: c }))}
                    style={[styles.catBtn, selected ? styles.catBtnActive : undefined]}
                    testID={`cat-${c}`}
                  >
                    <Text style={styles.catText}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity onPress={onSubmit} style={styles.submit} testID="submit-button">
              <Text style={styles.submitText}>Save item</Text>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingTop: Platform.OS === "ios" ? 110 : 90, paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  label: { color: Colors.light.textSecondary, marginBottom: 6, marginTop: 10 },
  input: {
    color: "#fff",
    backgroundColor: Colors.palette.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  row: { flexDirection: "row" },
  catWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  catBtnActive: { backgroundColor: "rgba(255,255,255,0.22)" },
  catText: { color: "#fff", fontSize: 12, fontWeight: "600" as const },
  submit: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
});