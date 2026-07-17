import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton.tsx';
import { RecipeFormPageBody } from '../features/recipes/components/RecipeFormPageBody.tsx';
import { NotFound } from '../components/NotFound.tsx';

export const EditRecipe = () => {
  const { id } = useParams();

  if (!id) {
    return <NotFound />;
  }

  return (
    <>
      <BackButton />
      <h1>Edit Recipe</h1>
      <RecipeFormPageBody recipeId={id} />
    </>
  );
};
