import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe, getAllRecipes } from '../service/recipesApi.ts';
import { Alert, CircularProgress, Fab } from '@mui/material';
import { RecipeTable } from './RecipeTable.tsx';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import type { Recipe } from '../types.ts';

export const RecipesPageBody = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => getAllRecipes(),
  });

  const deleteMutation = useMutation({
    mutationFn: (recipe: Recipe) => deleteRecipe(recipe.id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !data) {
    return <Alert severity="error">An error occurred while fetching recipes.</Alert>;
  }

  return (
    <>
      <RecipeTable recipes={data} onDeleteConfirm={(recipe) => deleteMutation.mutate(recipe)} />
      <Fab color="primary" aria-label="add" onClick={() => navigate('/add-recipe')}>
        <AddIcon />
      </Fab>
    </>
  );
};
