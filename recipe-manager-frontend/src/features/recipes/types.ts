interface RecipeBase {
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  difficulty: number;
  tags: string[];
}

export interface SavedRecipe extends RecipeBase {
  id: string;
}

export type RecipeDraft = RecipeBase;

export type RecipeUpsert = RecipeDraft | SavedRecipe;

export type Recipe = SavedRecipe;

export interface Ingredient {
  ingredientName: string;
  quantity: number;
  unit: string;
}
