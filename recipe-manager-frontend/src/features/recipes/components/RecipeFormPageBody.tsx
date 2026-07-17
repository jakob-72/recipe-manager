import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { RecipeForm } from './RecipeForm.tsx';
import { getRecipeById, saveRecipe } from '../service/recipesApi.ts';
import type { Recipe } from '../types.ts';
import type { ApiError } from '../../../shared/apiError.ts';
import { CenteredContent } from '../../../components/CenteredContent.tsx';
import { NotFound } from '../../../components/NotFound.tsx';

interface RecipeFormPageBodyProps {
  recipeId?: string;
}

export const RecipeFormPageBody = ({ recipeId }: RecipeFormPageBodyProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(recipeId);

  const {
    data: recipe,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ['recipeById', recipeId],
    queryFn: () => getRecipeById(recipeId!),
    enabled: isEditMode,
  });

  const {
    mutate,
    isPending,
    error: mutationError,
    reset,
  } = useMutation<Recipe | null, ApiError, Recipe>({
    mutationKey: ['saveRecipe'],
    mutationFn: saveRecipe,
    onSuccess: async () => {
      if (isEditMode) {
        await queryClient.invalidateQueries({ queryKey: ['recipeById', recipeId] });
        navigate(`/recipes/${recipeId}`);
      } else {
        navigate('/recipes');
      }
    },
  });

  const handleSubmit = useCallback((recipe: Recipe) => mutate(recipe), [mutate]);

  const handleCloseMutationError = useCallback(() => reset(), [reset]);

  if (isFetching || isPending) {
    return (
      <CenteredContent>
        <CircularProgress />
      </CenteredContent>
    );
  }

  if (fetchError) {
    return <Alert severity="error">An error occurred while fetching this recipe.</Alert>;
  }

  if (isEditMode && !recipe) {
    return <NotFound title="Recipe not found" content="No recipe found for the given ID." />;
  }

  return (
    <>
      <Snackbar
        open={Boolean(mutationError)}
        autoHideDuration={5000}
        onClose={handleCloseMutationError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseMutationError} severity="error" variant="filled">
          {mutationError?.message ??
            `An error occurred while ${isEditMode ? 'saving' : 'adding'} this recipe.`}
        </Alert>
      </Snackbar>
      <RecipeForm recipe={recipe ?? undefined} onSubmit={handleSubmit} />
    </>
  );
};
