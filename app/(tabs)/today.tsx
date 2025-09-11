import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, ActivityIndicator, SafeAreaView, Alert } from "react-native";
import Colors from "@/constants/colors";
import GlassCard from "@/components/GlassCard";
import { useFood } from "@/providers/FoodProvider";
import { useRecipes } from "@/providers/RecipeProvider";
import CategoryChip from "@/components/CategoryChip";
import { friendlyExpiry } from "@/utils/date";
import { ChefHat, X, Plus, Package, AlertTriangle, BarChart3, TrendingUp, Heart, Clock, Users } from "lucide-react-native";
import { router } from "expo-router";
import { parseAIResponse } from "@/utils/jsonParser";
import { adMobService } from "@/services/AdMobService";

type ItemProps = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryISO: string;
  category: string;
};

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

export default function TodayScreen() {
  const { todayPicks, expiringSoon, overdue, items } = useFood();
  const { saveRecipe, isRecipeSaved } = useRecipes();
  const [showRecipes, setShowRecipes] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  const stats = useMemo(() => {
    const totalItems = items.length;
    const needAttention = expiringSoon.length + overdue.length;
    const categories = new Set(items.map(item => item.category)).size;
    const freshRate = totalItems > 0 ? Math.round(((totalItems - overdue.length) / totalItems) * 100) : 0;
    
    return {
      totalItems,
      needAttention,
      categories,
      freshRate
    };
  }, [items, expiringSoon, overdue]);

  const generateRecipes = async () => {
    if (todayPicks.length === 0) {
      return;
    }

    // Show interstitial ad every 2nd time
    try {
      const adShown = await adMobService.showInterstitialAd();
      if (adShown) {
        console.log('Interstitial ad shown for recipe ideas');
      }
    } catch (error) {
      console.error('Error showing ad:', error);
    }

    setLoadingRecipes(true);
    setShowRecipes(true);

    try {
      const ingredients = todayPicks.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ");
      
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
              content: `I have these ingredients that need to be used soon: ${ingredients}. Please suggest 3 quick and easy recipes I can make with some or all of these ingredients. Include common pantry staples like salt, pepper, oil, etc. as needed. Provide nutritional information and serving sizes.`
            }
          ]
        })
      });

      const data = await response.json();
      
      try {
        const parsed = parseAIResponse(data.completion);
        setRecipes(parsed.recipes || []);
      } catch (parseError) {
        console.error("Failed to parse recipe JSON:", parseError);
        setRecipes([{
          title: "Quick Stir-fry",
          ingredients: todayPicks.slice(0, 3).map(item => item.name),
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
      setRecipes([{
        title: "Simple Mixed Dish",
        ingredients: todayPicks.slice(0, 3).map(item => item.name),
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
      <Stack.Screen
        options={{
          title: "Dashboard",
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
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Food Sense</Text>
            </View>
          </View>

          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.greetingSubtext}>Let's see what's fresh in your kitchen today</Text>
          </View>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add')}
          >
            <Plus size={20} color={Colors.palette.textPrimary} />
            <Text style={styles.addButtonText}>Add Food Item</Text>
          </TouchableOpacity>

          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard}>
                <Package size={24} color={Colors.palette.textPrimary} />
                <Text style={styles.statNumber}>{stats.totalItems}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </GlassCard>
              
              <GlassCard style={styles.statCard}>
                <AlertTriangle size={24} color={Colors.palette.warning} />
                <Text style={styles.statNumber}>{stats.needAttention}</Text>
                <Text style={styles.statLabel}>Need Attention</Text>
              </GlassCard>
            </View>
            
            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard}>
                <BarChart3 size={24} color={Colors.palette.textPrimary} />
                <Text style={styles.statNumber}>{stats.categories}</Text>
                <Text style={styles.statLabel}>Categories</Text>
              </GlassCard>
              
              <GlassCard style={styles.statCard}>
                <TrendingUp size={24} color={Colors.palette.success} />
                <Text style={styles.statNumber}>{stats.freshRate}%</Text>
                <Text style={styles.statLabel}>Fresh Rate</Text>
              </GlassCard>
            </View>
          </View>

          <GlassCard style={styles.expiryAlertsCard}>
            <View style={styles.expiryAlertsHeader}>
              <AlertTriangle size={24} color={Colors.palette.warning} />
              <Text style={styles.expiryAlertsTitle}>Expiry Alerts</Text>
            </View>
            
            {(expiringSoon.length > 0 || overdue.length > 0) ? (
              <View style={styles.expiryAlertsList}>
                {overdue.map((item) => (
                  <View key={item.id} style={styles.expiryItem}>
                    <View style={styles.expiryItemInfo}>
                      <Text style={styles.expiryItemName}>{item.name}</Text>
                      <Text style={[styles.expiryItemStatus, { color: Colors.palette.danger }]}>Expired</Text>
                    </View>
                    <CategoryChip category={item.category as any} />
                  </View>
                ))}
                {expiringSoon.map((item) => (
                  <View key={item.id} style={styles.expiryItem}>
                    <View style={styles.expiryItemInfo}>
                      <Text style={styles.expiryItemName}>{item.name}</Text>
                      <Text style={[styles.expiryItemStatus, { color: Colors.palette.warning }]}>Expires Soon</Text>
                    </View>
                    <CategoryChip category={item.category as any} />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noAlertsText}>All items are fresh! 🎉</Text>
            )}
          </GlassCard>

          {todayPicks.length > 0 && (
            <TouchableOpacity 
              style={styles.recipeBtn} 
              onPress={generateRecipes} 
              testID="recipe-ideas-btn"
            >
              <ChefHat color={Colors.palette.textPrimary} size={20} />
              <Text style={styles.recipeBtnText}>Get Recipe Ideas</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

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



const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  safeArea: { flex: 1 },
  scrollView: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.palette.textPrimary,
  },
  greetingSection: {
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
  },
  greetingSubtext: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    lineHeight: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.palette.textPrimary,
  },
  statsGrid: {
    gap: 16,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: Colors.palette.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    textAlign: "center",
  },
  expiryAlertsCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
  },
  expiryAlertsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  expiryAlertsTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: Colors.palette.textPrimary,
  },
  expiryAlertsList: {
    gap: 12,
  },
  expiryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  expiryItemInfo: {
    flex: 1,
  },
  expiryItemName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.palette.textPrimary,
    marginBottom: 4,
  },
  expiryItemStatus: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  noAlertsText: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  recipeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  recipeBtnText: { color: Colors.palette.textPrimary, fontWeight: "600" as const, fontSize: 16 },
  scrollContent: { paddingBottom: 100 },
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