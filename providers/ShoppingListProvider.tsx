import { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  createdAt: string;
};

type ShoppingItemPayload = Omit<ShoppingItem, "id" | "createdAt" | "completed">;

const STORAGE_KEY = "shopping_list_v1";

async function loadShoppingList(): Promise<ShoppingItem[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ShoppingItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load shopping list", e);
    return [];
  }
}

async function saveShoppingList(items: ShoppingItem[]): Promise<ShoppingItem[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

export const [ShoppingListProvider, useShoppingList] = createContextHook(() => {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const loadQuery = useQuery({
    queryKey: ["shopping-list"],
    queryFn: loadShoppingList,
  });

  const saveMutation = useMutation({
    mutationKey: ["shopping-list-save"],
    mutationFn: saveShoppingList,
  });
  const { mutate: saveMutate } = saveMutation;

  useEffect(() => {
    if (loadQuery.data) {
      console.log("Loaded shopping list items", loadQuery.data.length);
      setItems(loadQuery.data);
    }
  }, [loadQuery.data]);

  const addItem = useCallback((payload: ShoppingItemPayload) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      completed: false,
      ...payload,
    };
    const updated = [newItem, ...items];
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const toggleItem = useCallback((id: string) => {
    const updated = items.map((it) => 
      it.id === id ? { ...it, completed: !it.completed } : it
    );
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const removeItem = useCallback((id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const clearCompleted = useCallback(() => {
    const updated = items.filter((it) => !it.completed);
    setItems(updated);
    saveMutate(updated);
  }, [items, saveMutate]);

  const activeItems = useMemo(() => items.filter(it => !it.completed), [items]);
  const completedItems = useMemo(() => items.filter(it => it.completed), [items]);

  return useMemo(() => ({
    items,
    activeItems,
    completedItems,
    isLoading: loadQuery.isLoading,
    addItem,
    toggleItem,
    removeItem,
    clearCompleted,
  }), [items, activeItems, completedItems, loadQuery.isLoading, addItem, toggleItem, removeItem, clearCompleted]);
});
