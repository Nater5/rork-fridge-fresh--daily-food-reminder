import { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";

export type WasteEntry = {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category: string;
  reason: 'expired' | 'spoiled' | 'other';
  wastedAt: string;
};

type WasteEntryPayload = Omit<WasteEntry, "id" | "wastedAt">;

const STORAGE_KEY = "waste_tracking_v1";

async function loadWasteEntries(): Promise<WasteEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as WasteEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load waste entries", e);
    return [];
  }
}

async function saveWasteEntries(entries: WasteEntry[]): Promise<WasteEntry[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export const [WasteTrackingProvider, useWasteTracking] = createContextHook(() => {
  const [entries, setEntries] = useState<WasteEntry[]>([]);

  const loadQuery = useQuery({
    queryKey: ["waste-entries"],
    queryFn: loadWasteEntries,
  });

  const saveMutation = useMutation({
    mutationKey: ["waste-entries-save"],
    mutationFn: saveWasteEntries,
  });
  const { mutate: saveMutate } = saveMutation;

  useEffect(() => {
    if (loadQuery.data) {
      console.log("Loaded waste entries", loadQuery.data.length);
      setEntries(loadQuery.data);
    }
  }, [loadQuery.data]);

  const addWasteEntry = useCallback((payload: WasteEntryPayload) => {
    const newEntry: WasteEntry = {
      id: `waste-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      wastedAt: new Date().toISOString(),
      ...payload,
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveMutate(updated);
  }, [entries, saveMutate]);

  const removeWasteEntry = useCallback((id: string) => {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
    saveMutate(updated);
  }, [entries, saveMutate]);

  const stats = useMemo(() => {
    const totalItems = entries.length;
    const last30Days = entries.filter(entry => {
      const entryDate = new Date(entry.wastedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    const byCategory = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byReason = entries.reduce((acc, entry) => {
      acc[entry.reason] = (acc[entry.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems,
      last30Days: last30Days.length,
      byCategory,
      byReason,
    };
  }, [entries]);

  return useMemo(() => ({
    entries,
    stats,
    isLoading: loadQuery.isLoading,
    addWasteEntry,
    removeWasteEntry,
  }), [entries, stats, loadQuery.isLoading, addWasteEntry, removeWasteEntry]);
});
