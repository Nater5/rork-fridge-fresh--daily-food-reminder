import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { ChefHat, ArrowLeft, Clock, Users, Heart, Flame } from 'lucide-react-native';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';
import { useFood } from '@/providers/FoodProvider';
import { useRecipes, type NutritionInfo } from '@/providers/RecipeProvider';
import { adMobService } from '@/services/AdMobService';
import { parseAIResponse } from '@/utils/jsonParser';

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings?: string;
  nutrition?: NutritionInfo;
};

export default function RecipesScreen() {
  const { todayPicks } = useFood();
  const { saveRecipe, isRecipeSaved } = useRecipes();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const generateRecipes = async () => {
    if (todayPicks.length === 0) {
      setRecipes([{
        title: "No Ingredients Available",
        ingredients: ["Add some food items to your inventory first"],
        instructions: ["Go to the Add tab to add food items", "Come back here to get recipe suggestions"],
        cookTime: "N/A",
        servings: "N/A"
      }]);
      setHasGenerated(true);
      return;
    }

    // Show ad before generating recipes
    try {
      await adMobService.showInterstitialAd();
    } catch (error) {
      console.log('Ad failed to show:', error);
    }

    setLoading(true);

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
              content: "You are a helpful cooking assistant. Generate 5 diverse, practical recipes using the available ingredients. Focus on different cooking styles and cuisines. IMPORTANT: Always specify exact serving sizes (e.g., '4 servings', '2 servings', '6 servings') and ensure nutrition values are per serving. Format your response as JSON with this structure: {\"recipes\": [{\"title\": \"Recipe Name\", \"ingredients\": [\"ingredient 1\", \"ingredient 2\"], \"instructions\": [\"step 1\", \"step 2\"], \"cookTime\": \"15 minutes\", \"servings\": \"4 servings\", \"nutrition\": {\"calories\": 350, \"protein\": 25, \"carbs\": 30, \"fat\": 15, \"fiber\": 5}}]}"
            },
            {
              role: "user",
              content: `I have these ingredients that need to be used soon: ${ingredients}. Please suggest 5 diverse recipes I can make with some or all of these ingredients. Include common pantry staples like salt, pepper, oil, etc. as needed. Make them from different cuisines and cooking styles.`
            }
          ]
        })
      });

      const data = await response.json();
      
      try {
        console.log('Attempting to parse AI response...');
        const parsed = parseAIResponse(data.completion);
        setRecipes(parsed.recipes || []);
      } catch (parseError) {
        console.error("Failed to parse recipe JSON:", parseError);
        setRecipes([
          {
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
            servings: "2 servings",
            nutrition: {
              calories: 280,
              protein: 18,
              carbs: 25,
              fat: 12,
              fiber: 4
            }
          },
          {
            title: "Simple Soup",
            ingredients: todayPicks.slice(0, 4).map(item => item.name),
            instructions: [
              "Chop all ingredients into bite-sized pieces",
              "Heat oil in a pot and sauté aromatics",
              "Add remaining ingredients and cover with water or broth",
              "Simmer for 20-25 minutes until tender",
              "Season to taste and serve hot"
            ],
            cookTime: "30 minutes",
            servings: "4 servings",
            nutrition: {
              calories: 220,
              protein: 12,
              carbs: 35,
              fat: 6,
              fiber: 8
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to generate recipes:", error);
      setRecipes([{
        title: "Error Loading Recipes",
        ingredients: ["Unable to generate recipes at this time"],
        instructions: ["Please try again later", "Check your internet connection"],
        cookTime: "N/A",
        servings: "N/A"
      }]);
    } finally {
      setLoading(false);
      setHasGenerated(true);
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
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Saved Recipes",
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
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Ideas</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.introSection}>
            <ChefHat size={48} color={Colors.palette.textPrimary} />
            <Text style={styles.introTitle}>Discover Delicious Recipes</Text>
            <Text style={styles.introSubtitle}>
              Get personalized recipe suggestions based on your available ingredients
            </Text>
          </View>

          {!hasGenerated && (
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={generateRecipes}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.palette.textPrimary} />
              ) : (
                <ChefHat size={20} color={Colors.palette.textPrimary} />
              )}
              <Text style={styles.generateButtonText}>
                {loading ? "Generating Recipes..." : "Generate Recipe Ideas"}
              </Text>
            </TouchableOpacity>
          )}

          {hasGenerated && (
            <View style={styles.recipesContainer}>
              <View style={styles.recipesHeader}>
                <Text style={styles.recipesTitle}>Your Recipe Collection</Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={generateRecipes}
                  disabled={loading}
                >
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>

              {recipes.map((recipe, index) => (
                <GlassCard key={index} style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <TouchableOpacity 
                      onPress={() => handleSaveRecipe(recipe)}
                      style={[
                        styles.saveButton,
                        isRecipeSaved(recipe.title) && styles.saveButtonSaved
                      ]}
                      disabled={isRecipeSaved(recipe.title)}
                    >
                      <Heart 
                        size={20} 
                        color={isRecipeSaved(recipe.title) ? Colors.palette.textPrimary : Colors.palette.textSecondary}
                        fill={isRecipeSaved(recipe.title) ? Colors.palette.textPrimary : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.recipeMetadata}>
                    {recipe.cookTime && (
                      <View style={styles.metadataItem}>
                        <Clock size={16} color={Colors.palette.textSecondary} />
                        <Text style={styles.metadataText}>{recipe.cookTime}</Text>
                      </View>
                    )}
                    {recipe.servings && (
                      <View style={styles.metadataItem}>
                        <Users size={16} color={Colors.palette.textSecondary} />
                        <Text style={styles.metadataText}>{recipe.servings}</Text>
                      </View>
                    )}
                    {recipe.nutrition?.calories && (
                      <View style={styles.metadataItem}>
                        <Flame size={16} color={Colors.palette.textSecondary} />
                        <Text style={styles.metadataText}>{recipe.nutrition.calories} cal</Text>
                      </View>
                    )}
                  </View>
                  
                  {recipe.nutrition && (
                    <View style={styles.nutritionSection}>
                      <Text style={styles.sectionTitle}>Nutrition (per serving):</Text>
                      <View style={styles.nutritionGrid}>
                        {recipe.nutrition.protein && (
                          <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                            <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                          </View>
                        )}
                        {recipe.nutrition.carbs && (
                          <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Carbs</Text>
                            <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                          </View>
                        )}
                        {recipe.nutrition.fat && (
                          <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Fat</Text>
                            <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                          </View>
                        )}
                        {recipe.nutrition.fiber && (
                          <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Fiber</Text>
                            <Text style={styles.nutritionValue}>{recipe.nutrition.fiber}g</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  
                  <View style={styles.recipeSection}>
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    {recipe.ingredients.map((ingredient, i) => (
                      <Text key={i} style={styles.ingredient}>• {ingredient}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.recipeSection}>
                    <Text style={styles.sectionTitle}>Instructions:</Text>
                    {recipe.instructions.map((step, i) => (
                      <Text key={i} style={styles.instruction}>{i + 1}. {step}</Text>
                    ))}
                  </View>
                </GlassCard>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 30,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  recipesContainer: {
    gap: 20,
    paddingBottom: 30,
  },
  recipesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recipesTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  refreshButton: {
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  recipeCard: {
    padding: 24,
    borderRadius: 20,
    gap: 20,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recipeMetadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
  },
  recipeSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 4,
  },
  ingredient: {
    fontSize: 15,
    color: Colors.palette.textSecondary,
    lineHeight: 22,
    paddingLeft: 8,
  },
  instruction: {
    fontSize: 15,
    color: Colors.palette.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  nutritionSection: {
    gap: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.palette.textSecondary,
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
});