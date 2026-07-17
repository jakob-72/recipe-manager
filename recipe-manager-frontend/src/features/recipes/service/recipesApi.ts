import type { Recipe } from '../types.ts';
import { deleteRequest, get, post, put } from '../../../shared/apiClient.ts';
import { ApiError } from '../../../shared/apiError.ts';
import { logger } from '../../../shared/logger.ts';

export const getAllRecipes = async (): Promise<Recipe[]> => get('/api/recipes');

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    return await get(`/api/recipes/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return null;
    }
    throw e;
  }
};

export const saveRecipe = async (recipe: Recipe): Promise<Recipe | null> => {
  if (recipe.id) {
    logger.info('Updating recipe with ID', recipe);
    return await put(`/api/recipes/${recipe.id}`, recipe);
  }
  logger.info('Submitting a new recipe', recipe.name);
  return await post(`/api/recipes`, recipe);
};

export const deleteRecipe = async (recipeId: string): Promise<void> =>
  deleteRequest(`/api/recipes/${recipeId}`);
