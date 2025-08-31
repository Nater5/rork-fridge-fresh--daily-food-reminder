import { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { daysUntil, toISODate } from "@/utils/date";
import type { Category } from "@/constants/categories";

export type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryISO: string;
  category: Category;
  createdAt: string;
};

type AddPayload = Omit<FoodItem, "id" | "createdAt">;

const STORAGE_KEY = "food_items_v1";

async function loadItems(): Promise<FoodItem[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as FoodItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load items", e);
    return [];
  }
}

async function saveItems(items: FoodItem[]): Promise<FoodItem[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

export const [FoodProvider, useFood] = createContextHook(() => {
  const [items, setItems] = useState<FoodItem[]>([]);

  const loadQuery = useQuery({
    queryKey: ["food-items"],
    queryFn: loadItems,
  });

  const saveMutation = useMutation({
    mutationKey: ["food-items-save"],
    mutationFn: saveItems,
  });
  const { mutate: saveMutate } = saveMutation;

  useEffect(() => {
    if (loadQuery.data) {
      console.log("Loaded items", loadQuery.data.length);
      setItems(loadQuery.data);
    }
  }, [loadQuery.data]);

  const addItem = useCallback((payload: AddPayload) => {
    const newItem: FoodItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: toISODate(new Date()),
      ...payload,
    };
    const updated = [newItem, ...items];
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const updateItem = useCallback((id: string, patch: Partial<FoodItem>) => {
    const updated = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const removeItem = useCallback((id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const expiringSoon = useMemo(() => {
    const sorted = [...items].sort((a, b) => new Date(a.expiryISO).getTime() - new Date(b.expiryISO).getTime());
    return sorted.filter((it) => daysUntil(it.expiryISO) <= 3);
  }, [items]);

  const overdue = useMemo(() => items.filter((it) => daysUntil(it.expiryISO) < 0), [items]);

  const todayPicks = useMemo(() => {
    const soon = expiringSoon.slice(0, 6);
    return soon.length > 0 ? soon : items.slice(0, 6);
  }, [expiringSoon, items]);

  return useMemo(() => ({
    items,
    isLoading: loadQuery.isLoading,
    addItem,
    updateItem,
    removeItem,
    expiringSoon,
    overdue,
    todayPicks,
  }), [items, loadQuery.isLoading, addItem, updateItem, removeItem, expiringSoon, overdue, todayPicks]);
});