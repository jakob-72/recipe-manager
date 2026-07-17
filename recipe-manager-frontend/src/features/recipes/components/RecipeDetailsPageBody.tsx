import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '../service/recipesApi.ts';
import { Alert, CircularProgress } from '@mui/material';
import { RecipeDetailsTable } from './RecipeDetailsTable.tsx';
import { NotFound } from '../../../components/NotFound.tsx';
import { CenteredContent } from '../../../components/CenteredContent.tsx';
import { useNavigate } from 'react-router';

interface RecipeDetailsPageBodyProps {
  recipeId: string;
}

export const RecipeDetailsPageBody = ({ recipeId }: RecipeDetailsPageBodyProps) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipeById', recipeId],
    queryFn: async () => getRecipeById(recipeId),
  });

  if (isLoading) {
    return (
      <CenteredContent>
        <CircularProgress />
      </CenteredContent>
    );
  }

  if (error) {
    return <Alert severity="error">An error occurred while fetching this recipe.</Alert>;
  }

  if (!data) {
    return <NotFound title={'Recipe not found'} content={'No recipe found for the given ID,'} />;
  }

  return <RecipeDetailsTable recipe={data} onEdit={() => navigate(`/recipes/${recipeId}/edit`)} />;
};
