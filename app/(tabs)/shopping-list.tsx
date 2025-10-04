import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { ShoppingCart, Plus, Trash2, Check, X } from 'lucide-react-native';
import Colors from '../../constants/colors';
import GlassCard from '../../components/GlassCard';
import { useShoppingList } from '../../providers/ShoppingListProvider';
import { CATEGORIES, Category } from '../../constants/categories';
import CategoryChip from '../../components/CategoryChip';

export default function ShoppingListScreen() {
  const { activeItems, completedItems, addItem, toggleItem, removeItem, clearCompleted } = useShoppingList();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'pcs',
    category: 'Other' as Category,
  });

  const handleAddItem = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Please enter an item name');
      return;
    }
    const qty = Number(form.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert('Validation', 'Quantity must be a positive number');
      return;
    }

    addItem({
      name: form.name.trim(),
      quantity: qty,
      unit: form.unit.trim() || 'pcs',
      category: form.category,
    });

    setForm({ name: '', quantity: '', unit: 'pcs', category: 'Other' });
    setShowAddModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Item', `Remove "${name}" from shopping list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeItem(id) },
    ]);
  };

  const handleClearCompleted = () => {
    if (completedItems.length === 0) return;
    Alert.alert('Clear Completed', `Remove ${completedItems.length} completed items?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCompleted },
    ]);
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: 'Shopping List',
          headerShown: false,
        }}
      />
      <LinearGradient
        colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ShoppingCart size={28} color={Colors.palette.textPrimary} />
          <Text style={styles.headerTitle}>Shopping List</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={styles.addButton}
          >
            <Plus size={24} color={Colors.palette.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeItems.length === 0 && completedItems.length === 0 ? (
            <View style={styles.emptyState}>
              <ShoppingCart size={64} color={Colors.palette.textSecondary} />
              <Text style={styles.emptyTitle}>No Items Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add items to your shopping list to get started
              </Text>
            </View>
          ) : (
            <>
              {activeItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    To Buy ({activeItems.length})
                  </Text>
                  {activeItems.map((item) => (
                    <GlassCard key={item.id} style={styles.itemCard}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => toggleItem(item.id)}
                      >
                        <View style={styles.checkbox}>
                          <View style={styles.checkboxInner} />
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemMeta}>
                            {item.quantity} {item.unit}
                          </Text>
                          <View style={{ marginTop: 8 }}>
                            <CategoryChip category={item.category as any} />
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDelete(item.id, item.name)}
                          style={styles.deleteButton}
                        >
                          <Trash2 size={20} color={Colors.palette.textSecondary} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </GlassCard>
                  ))}
                </View>
              )}

              {completedItems.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.completedHeader}>
                    <Text style={styles.sectionTitle}>
                      Completed ({completedItems.length})
                    </Text>
                    <TouchableOpacity
                      onPress={handleClearCompleted}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  {completedItems.map((item) => (
                    <GlassCard key={item.id} style={[styles.itemCard, styles.completedCard]}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => toggleItem(item.id)}
                      >
                        <View style={[styles.checkbox, styles.checkboxChecked]}>
                          <Check size={16} color="#fff" />
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, styles.completedText]}>
                            {item.name}
                          </Text>
                          <Text style={[styles.itemMeta, styles.completedText]}>
                            {item.quantity} {item.unit}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDelete(item.id, item.name)}
                          style={styles.deleteButton}
                        >
                          <Trash2 size={20} color={Colors.palette.textSecondary} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </GlassCard>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalRoot}>
          <LinearGradient
            colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Item</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContent}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <GlassCard style={styles.formCard}>
                  <Text style={styles.label}>Item Name</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
                    placeholder="e.g., Milk"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    style={styles.input}
                  />

                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Quantity</Text>
                      <TextInput
                        value={form.quantity}
                        onChangeText={(t) => setForm((s) => ({ ...s, quantity: t }))}
                        placeholder="e.g., 2"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Unit</Text>
                      <TextInput
                        value={form.unit}
                        onChangeText={(t) => setForm((s) => ({ ...s, unit: t }))}
                        placeholder="e.g., L, kg"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryWrap}>
                    {CATEGORIES.map((c) => {
                      const selected = c === form.category;
                      return (
                        <TouchableOpacity
                          key={c}
                          onPress={() => setForm((s) => ({ ...s, category: c }))}
                          style={[styles.categoryBtn, selected && styles.categoryBtnActive]}
                        >
                          <Text style={styles.categoryText}>{c}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity onPress={handleAddItem} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Add to List</Text>
                  </TouchableOpacity>
                </GlassCard>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 16,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.palette.textSecondary,
  },
  itemCard: {
    marginBottom: 12,
    padding: 0,
  },
  completedCard: {
    opacity: 0.6,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: Colors.palette.success,
    borderColor: Colors.palette.success,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.palette.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    color: '#fff',
    backgroundColor: Colors.palette.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  row: {
    flexDirection: 'row',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  categoryBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 16,
  },
});
