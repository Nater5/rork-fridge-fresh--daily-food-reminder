import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { BookOpen, Clock, Users, Trash2, Flame, Search, Filter, SortAsc } from 'lucide-react-native';
import Colors from '@/constants/colors';
import GlassCard from '@/components/GlassCard';
import { useRecipes, type Recipe } from '@/providers/RecipeProvider';

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'cookTime';
type FilterOption = 'all' | 'quick' | 'healthy';

export default function RecipeBookScreen() {
  const { savedRecipes, removeRecipe } = useRecipes();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = savedRecipes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(recipe => {
        switch (filterBy) {
          case 'quick':
            return recipe.cookTime && parseInt(recipe.cookTime) <= 30;
          case 'healthy':
            return recipe.nutrition && recipe.nutrition.calories && recipe.nutrition.calories < 400;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest':
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'cookTime':
          const aTime = a.cookTime ? parseInt(a.cookTime) : 999;
          const bTime = b.cookTime ? parseInt(b.cookTime) : 999;
          return aTime - bTime;
        default:
          return 0;
      }
    });

    return sorted;
  }, [savedRecipes, searchQuery, sortBy, filterBy]);

  const handleDeleteRecipe = (recipeId: string, recipeTitle: string) => {
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to remove "${recipeTitle}" from your recipe book?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => removeRecipe(recipeId)
        }
      ]
    );
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Recipe Book",
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
          <BookOpen size={28} color={Colors.palette.textPrimary} />
          <Text style={styles.headerTitle}>My Recipe Book</Text>
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterToggle}
          >
            <Filter size={24} color={Colors.palette.textPrimary} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.palette.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search recipes or ingredients..."
                placeholderTextColor={Colors.palette.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                  {(['newest', 'oldest', 'alphabetical', 'cookTime'] as SortOption[]).map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSortBy(option)}
                      style={[styles.filterChip, sortBy === option && styles.filterChipActive]}
                    >
                      <Text style={[styles.filterChipText, sortBy === option && styles.filterChipTextActive]}>
                        {option === 'newest' ? 'Newest' : 
                         option === 'oldest' ? 'Oldest' :
                         option === 'alphabetical' ? 'A-Z' : 'Cook Time'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Filter:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                  {(['all', 'quick', 'healthy'] as FilterOption[]).map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFilterBy(option)}
                      style={[styles.filterChip, filterBy === option && styles.filterChipActive]}
                    >
                      <Text style={[styles.filterChipText, filterBy === option && styles.filterChipTextActive]}>
                        {option === 'all' ? 'All' : 
                         option === 'quick' ? 'Quick (≤30min)' : 'Healthy (<400 cal)'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {savedRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={64} color={Colors.palette.textSecondary} />
              <Text style={styles.emptyTitle}>No Saved Recipes</Text>
              <Text style={styles.emptySubtitle}>
                Save recipes from the recipe suggestions to build your personal collection
              </Text>
            </View>
          ) : filteredAndSortedRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={64} color={Colors.palette.textSecondary} />
              <Text style={styles.emptyTitle}>No Recipes Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          ) : (
            <View style={styles.recipesContainer}>
              <Text style={styles.recipesCount}>
                {filteredAndSortedRecipes.length} of {savedRecipes.length} {savedRecipes.length === 1 ? 'Recipe' : 'Recipes'}
                {searchQuery.trim() || filterBy !== 'all' ? ' (filtered)' : ''}
              </Text>
              
              {filteredAndSortedRecipes.map((recipe) => (
                <GlassCard key={recipe.id} style={styles.recipeCard}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <TouchableOpacity 
                      onPress={() => handleDeleteRecipe(recipe.id, recipe.title)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={20} color={Colors.palette.textSecondary} />
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.palette.textPrimary,
  },
  filterRow: {
    gap: 8,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    paddingHorizontal: 4,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: Colors.palette.glassBg,
    borderWidth: 1,
    borderColor: Colors.palette.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.palette.textPrimary,
    fontWeight: '600' as const,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
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
  recipesContainer: {
    gap: 20,
    paddingBottom: 30,
  },
  recipesCount: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
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
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  recipeMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});