import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ScrollView, ActivityIndicator } from "react-native";
import Colors from "@/constants/colors";
import GlassCard from "@/components/GlassCard";
import { useFood, FoodItem } from "@/providers/FoodProvider";
import { useRecipes } from "@/providers/RecipeProvider";
import CategoryChip from "@/components/CategoryChip";
import { friendlyExpiry } from "@/utils/date";
import { Trash2, ChefHat, X, Check, Heart, Clock, Users } from "lucide-react-native";
import { adMobService } from "@/services/AdMobService";

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  servings?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
};

export default function InventoryScreen() {
  const { items, removeItem } = useFood();
  const { saveRecipe, isRecipeSaved } = useRecipes();
  const [search, setSearch] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showRecipes, setShowRecipes] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.name.toLowerCase().includes(q));
  }, [items, search]);

  const confirmDelete = (item: FoodItem) => {
    Alert.alert("Delete item", `Remove ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("Removing item", item.id);
          removeItem(item.id);
        },
      },
    ]);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === filtered.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filtered.map(item => item.id)));
    }
  };

  const generateRecipes = async () => {
    if (selectedItems.size === 0) {
      Alert.alert("No items selected", "Please select at least one item to generate recipes.");
      return;
    }

    // Show ad before generating recipes
    try {
      await adMobService.showInterstitialAd();
    } catch (error) {
      console.log('Ad failed to show:', error);
    }

    setLoadingRecipes(true);
    setShowRecipes(true);

    try {
      const selectedFoodItems = items.filter(item => selectedItems.has(item.id));
      const ingredients = selectedFoodItems.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ");
      
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful cooking assistant. Generate 3 simple, practical recipes using the available ingredients. Focus on quick meals that can be prepared in 30 minutes or less. Include nutritional information (calories, protein, carbs, fat) per serving and specify how many servings the recipe makes. Format your response as JSON with this structure: {\"recipes\": [{\"title\": \"Recipe Name\", \"ingredients\": [\"ingredient 1\", \"ingredient 2\"], \"instructions\": [\"step 1\", \"step 2\"], \"cookTime\": \"15 minutes\", \"servings\": \"Makes 4 servings\", \"nutrition\": {\"calories\": 350, \"protein\": 25, \"carbs\": 30, \"fat\": 15}}]}"
            },
            {
              role: "user",
              content: `I have these ingredients: ${ingredients}. Please suggest 3 quick and easy recipes I can make with some or all of these ingredients. Include common pantry staples like salt, pepper, oil, etc. as needed. Provide nutritional information and serving sizes.`
            }
          ]
        })
      });

      const data = await response.json();
      
      try {
        let cleanedResponse = data.completion.trim();
        
        // Remove markdown code blocks
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Find JSON object boundaries
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('Attempting to parse JSON:', cleanedResponse.substring(0, 200) + '...');
        const parsed = JSON.parse(cleanedResponse);
        setRecipes(parsed.recipes || []);
      } catch (parseError) {
        console.error("Failed to parse recipe JSON:", parseError);
        const selectedFoodItems = items.filter(item => selectedItems.has(item.id));
        setRecipes([{
          title: "Quick Stir-fry",
          ingredients: selectedFoodItems.slice(0, 3).map(item => item.name),
          instructions: [
            "Heat oil in a large pan or wok",
            "Add ingredients in order of cooking time needed",
            "Stir-fry for 5-10 minutes until cooked through",
            "Season with salt, pepper, and your favorite spices",
            "Serve hot"
          ],
          cookTime: "15 minutes",
          servings: "Makes 3 servings",
          nutrition: { calories: 300, protein: 20, carbs: 25, fat: 12 }
        }]);
      }
    } catch (error) {
      console.error("Failed to generate recipes:", error);
      const selectedFoodItems = items.filter(item => selectedItems.has(item.id));
      setRecipes([{
        title: "Simple Mixed Dish",
        ingredients: selectedFoodItems.slice(0, 3).map(item => item.name),
        instructions: [
          "Prepare all ingredients by washing and chopping as needed",
          "Cook ingredients according to their type (sauté vegetables, boil grains, etc.)",
          "Combine ingredients in a serving dish",
          "Season to taste with salt, pepper, and herbs",
          "Enjoy your meal!"
        ],
        cookTime: "20 minutes",
        servings: "Makes 3 servings",
        nutrition: { calories: 250, protein: 15, carbs: 30, fat: 10 }
      }]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    saveRecipe({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      nutrition: recipe.nutrition
    });
    Alert.alert("Recipe Saved!", `${recipe.title} has been added to your recipe book.`);
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: "Inventory", headerTransparent: true }} />
      <LinearGradient colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <View style={styles.content}>
        <GlassCard>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search items"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            inputMode="text"
            testID="search-input"
          />
        </GlassCard>

        {filtered.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.selectAllBtn}
              onPress={selectAllItems}
            >
              <Check color={Colors.palette.textPrimary} size={16} />
              <Text style={styles.selectAllText}>
                {selectedItems.size === filtered.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
            
            {selectedItems.size > 0 && (
              <TouchableOpacity 
                style={styles.recipeBtn}
                onPress={generateRecipes}
              >
                <ChefHat color={Colors.palette.textPrimary} size={16} />
                <Text style={styles.recipeBtnText}>Get Recipes ({selectedItems.size})</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Row 
              item={item} 
              onDelete={confirmDelete}
              isSelected={selectedItems.has(item.id)}
              onToggleSelect={() => toggleItemSelection(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
        />
      </View>

      <Modal
        visible={showRecipes}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRecipes(false)}
      >
        <View style={styles.modalRoot}>
          <LinearGradient
            colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Recipe Ideas</Text>
            <TouchableOpacity 
              onPress={() => setShowRecipes(false)}
              style={styles.closeBtn}
            >
              <X color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {loadingRecipes ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Generating recipes...</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {recipes.map((recipe, index) => (
                <GlassCard key={index} style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <TouchableOpacity 
                      style={[styles.saveBtn, isRecipeSaved(recipe.title) && styles.savedBtn]}
                      onPress={() => handleSaveRecipe(recipe)}
                      disabled={isRecipeSaved(recipe.title)}
                    >
                      <Heart 
                        color={isRecipeSaved(recipe.title) ? Colors.palette.danger : Colors.palette.textPrimary} 
                        size={20}
                        fill={isRecipeSaved(recipe.title) ? Colors.palette.danger : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.recipeMetaRow}>
                    {recipe.cookTime && (
                      <View style={styles.metaItem}>
                        <Clock size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.metaText}>{recipe.cookTime}</Text>
                      </View>
                    )}
                    {recipe.servings && (
                      <View style={styles.metaItem}>
                        <Users size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.metaText}>{recipe.servings}</Text>
                      </View>
                    )}
                  </View>

                  {recipe.nutrition && (
                    <View style={styles.nutritionContainer}>
                      <Text style={styles.sectionTitle}>Nutrition (per serving):</Text>
                      <View style={styles.nutritionGrid}>
                        {recipe.nutrition.calories && (
                          <Text style={styles.nutritionItem}>🔥 {recipe.nutrition.calories} cal</Text>
                        )}
                        {recipe.nutrition.protein && (
                          <Text style={styles.nutritionItem}>🥩 {recipe.nutrition.protein}g protein</Text>
                        )}
                        {recipe.nutrition.carbs && (
                          <Text style={styles.nutritionItem}>🌾 {recipe.nutrition.carbs}g carbs</Text>
                        )}
                        {recipe.nutrition.fat && (
                          <Text style={styles.nutritionItem}>🥑 {recipe.nutrition.fat}g fat</Text>
                        )}
                      </View>
                    </View>
                  )}
                  
                  <Text style={styles.sectionTitle}>Ingredients:</Text>
                  {recipe.ingredients.map((ingredient, i) => (
                    <Text key={i} style={styles.ingredient}>• {ingredient}</Text>
                  ))}
                  
                  <Text style={styles.sectionTitle}>Instructions:</Text>
                  {recipe.instructions.map((step, i) => (
                    <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
                  ))}
                </GlassCard>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

function Row({ 
  item, 
  onDelete, 
  isSelected, 
  onToggleSelect 
}: { 
  item: FoodItem; 
  onDelete: (it: FoodItem) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const exp = friendlyExpiry(item.expiryISO);
  return (
    <TouchableOpacity onPress={onToggleSelect}>
      <GlassCard style={[styles.itemCard, isSelected && styles.selectedCard]}>
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
              {isSelected && <Check color="#fff" size={16} />}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.quantity} {item.unit} • {exp.label}
            </Text>
            <View style={{ marginTop: 8 }}>
              <CategoryChip category={item.category} />
            </View>
          </View>
          <TouchableOpacity onPress={() => onDelete(item)} style={styles.iconBtn} testID={`delete-${item.id}`}>
            <Trash2 color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, paddingTop: Platform.OS === "ios" ? 110 : 90, paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  input: {
    color: "#fff",
    backgroundColor: Colors.palette.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  listContent: { paddingBottom: 60, gap: 12 },
  empty: { color: Colors.light.textSecondary, textAlign: "center", marginTop: 24 },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  selectAllText: {
    color: Colors.palette.textPrimary,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  recipeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  recipeBtnText: {
    color: Colors.palette.textPrimary,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  selectedCard: {
    borderColor: Colors.palette.textPrimary,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkboxContainer: {
    marginRight: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: Colors.palette.textPrimary,
    borderColor: Colors.palette.textPrimary,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  meta: { color: Colors.light.textSecondary, marginTop: 2 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700" as const,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  recipeCard: {
    marginBottom: 16,
  },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recipeTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700" as const,
    flex: 1,
    marginRight: 12,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  savedBtn: {
    backgroundColor: "rgba(255,100,100,0.2)",
    borderColor: Colors.palette.danger,
  },
  recipeMetaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  nutritionContainer: {
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  nutritionItem: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
    marginTop: 12,
    marginBottom: 8,
  },
  ingredient: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  instruction: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});