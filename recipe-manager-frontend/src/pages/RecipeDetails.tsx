import { useParams } from 'react-router';
import { RecipeDetailsPageBody } from '../features/recipes/components/RecipeDetailsPageBody.tsx';
import { NotFound } from '../components/NotFound.tsx';
import { BackButton } from '../components/BackButton.tsx';

export const RecipeDetails = () => {
  const params = useParams();
  const recipeId = params.id;

  if (!recipeId || recipeId === '') {
    return <NotFound />;
  }

  return (
    <>
      <BackButton />
      <RecipeDetailsPageBody recipeId={recipeId} />
    </>
  );
};
