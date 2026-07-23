import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../shared/apiClient.ts', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  deleteRequest: vi.fn(),
}));

import { get, post, put, deleteRequest } from '../../../../shared/apiClient.ts';
import { ApiError } from '../../../../shared/apiError.ts';
import {
  getAllRecipes,
  getRecipeById,
  saveRecipe,
  deleteRecipe,
} from '../../../../features/recipes/service/recipesApi.ts';
import type { Recipe, RecipeDraft } from '../../../../features/recipes/types.ts';

const mockedGet = vi.mocked(get);
const mockedPost = vi.mocked(post);
const mockedPut = vi.mocked(put);
const mockedDeleteRequest = vi.mocked(deleteRequest);

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
  instructions: 'Boil water and cook noodles.',
  difficulty: 2,
  tags: ['dinner'],
};

describe('recipesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllRecipes', () => {
    it('should return list of recipes when request succeeds', async () => {
      mockedGet.mockResolvedValue([recipe]);

      const result = await getAllRecipes();

      expect(result).toEqual([recipe]);
      expect(mockedGet).toHaveBeenCalledWith('/api/recipes');
    });

    it('should rethrow any API errors', async () => {
      mockedGet.mockRejectedValueOnce(new Error());

      await expect(getAllRecipes()).rejects.toThrow();
    });
  });

  describe('getRecipeById', () => {
    it('should return a recipe when request succeeds', async () => {
      mockedGet.mockResolvedValue(recipe);

      const result = await getRecipeById('recipe-1');

      expect(result).toEqual(recipe);
      expect(mockedGet).toHaveBeenCalledWith('/api/recipes/recipe-1');
    });

    it('should return null when response status is 404', async () => {
      mockedGet.mockRejectedValue(new ApiError('Not Found', 404));

      await expect(getRecipeById('missing-recipe')).resolves.toBeNull();
      expect(mockedGet).toHaveBeenCalledWith('/api/recipes/missing-recipe');
    });

    it('should rethrow unexpected API errors', async () => {
      const error = new ApiError('Server error', 500);
      mockedGet.mockRejectedValue(error);

      await expect(getRecipeById('recipe-1')).rejects.toThrow(error);
    });
  });

  describe('saveRecipe', () => {
    it('should call post when recipe has no id', async () => {
      const newRecipe: RecipeDraft = {
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        difficulty: recipe.difficulty,
        tags: recipe.tags,
      };
      mockedPost.mockResolvedValue(recipe);

      await saveRecipe(newRecipe);

      expect(mockedPost).toHaveBeenCalledWith('/api/recipes', newRecipe);
      expect(mockedPut).not.toHaveBeenCalled();
    });

    it('should call put when recipe has an id', async () => {
      mockedPut.mockResolvedValue(recipe);

      await saveRecipe(recipe);

      expect(mockedPut).toHaveBeenCalledWith('/api/recipes/recipe-1', recipe);
      expect(mockedPost).not.toHaveBeenCalled();
    });

    it('should rethrow errors from post', async () => {
      mockedPost.mockRejectedValue(new ApiError('Server error', 500));

      const newRecipe: RecipeDraft = {
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        difficulty: recipe.difficulty,
        tags: recipe.tags,
      };

      await expect(saveRecipe(newRecipe)).rejects.toThrow();
    });

    it('should rethrow errors from put', async () => {
      mockedPut.mockRejectedValue(new ApiError('Server error', 500));

      await expect(saveRecipe(recipe)).rejects.toThrow();
    });
  });

  describe('deleteRecipe', () => {
    it('should call deleteRequest with the correct path', async () => {
      mockedDeleteRequest.mockResolvedValue(undefined);

      await deleteRecipe('recipe-1');

      expect(mockedDeleteRequest).toHaveBeenCalledWith('/api/recipes/recipe-1');
    });

    it('should rethrow errors from deleteRequest', async () => {
      mockedDeleteRequest.mockRejectedValue(new ApiError('Not Found', 404));

      await expect(deleteRecipe('missing')).rejects.toThrow();
    });
  });
});
