import { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";

export type NutritionInfo = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  servings?: string;
  nutrition?: NutritionInfo;
  savedAt: string;
};

type RecipePayload = Omit<Recipe, "id" | "savedAt">;

const STORAGE_KEY = "saved_recipes_v1";

async function loadRecipes(): Promise<Recipe[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load recipes", e);
    return [];
  }
}

async function saveRecipes(recipes: Recipe[]): Promise<Recipe[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipes;
}

export const [RecipeProvider, useRecipes] = createContextHook(() => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const loadQuery = useQuery({
    queryKey: ["saved-recipes"],
    queryFn: loadRecipes,
  });

  const saveMutation = useMutation({
    mutationKey: ["saved-recipes-save"],
    mutationFn: saveRecipes,
  });
  const { mutate: saveMutate } = saveMutation;

  useEffect(() => {
    if (loadQuery.data) {
      console.log("Loaded recipes", loadQuery.data.length);
      setSavedRecipes(loadQuery.data);
    }
  }, [loadQuery.data]);

  const saveRecipe = useCallback((payload: RecipePayload) => {
    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      savedAt: new Date().toISOString(),
      ...payload,
    };
    const updated = [newRecipe, ...savedRecipes];
    setSavedRecipes(updated);
    saveMutate(updated);
  }, [savedRecipes, saveMutate]);

  const removeRecipe = useCallback((id: string) => {
    const updated = savedRecipes.filter((recipe) => recipe.id !== id);
    setSavedRecipes(updated);
    saveMutate(updated);
  }, [savedRecipes, saveMutate]);

  const isRecipeSaved = useCallback((title: string) => {
    return savedRecipes.some(recipe => recipe.title === title);
  }, [savedRecipes]);

  return useMemo(() => ({
    savedRecipes,
    isLoading: loadQuery.isLoading,
    saveRecipe,
    removeRecipe,
    isRecipeSaved,
  }), [savedRecipes, loadQuery.isLoading, saveRecipe, removeRecipe, isRecipeSaved]);
});