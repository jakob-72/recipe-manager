import type { RecipeUpsert, SavedRecipe } from '../types.ts';
import { deleteRequest, get, post, put } from '../../../shared/apiClient.ts';
import { ApiError } from '../../../shared/apiError.ts';
import { logger } from '../../../shared/logger.ts';

export const getAllRecipes = async (): Promise<SavedRecipe[]> => get<SavedRecipe[]>('/api/recipes');

export const getRecipeById = async (id: string): Promise<SavedRecipe | null> => {
  try {
    return await get<SavedRecipe>(`/api/recipes/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return null;
    }
    throw e;
  }
};

export const saveRecipe = async (recipe: RecipeUpsert): Promise<SavedRecipe | null> => {
  if ('id' in recipe) {
    logger.info('Updating recipe with ID', recipe);
    return await put<SavedRecipe>(`/api/recipes/${recipe.id}`, recipe);
  }
  logger.info('Submitting a new recipe', recipe.name);
  return await post<SavedRecipe, RecipeUpsert>(`/api/recipes`, recipe);
};

export const deleteRecipe = async (recipeId: string): Promise<void> =>
  deleteRequest(`/api/recipes/${recipeId}`);
