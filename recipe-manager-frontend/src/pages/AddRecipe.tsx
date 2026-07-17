import { BackButton } from '../components/BackButton.tsx';
import { RecipeFormPageBody } from '../features/recipes/components/RecipeFormPageBody.tsx';

export const AddRecipe = () => {
  return (
    <>
      <BackButton />
      <h1>Add Recipe</h1>
      <RecipeFormPageBody />
    </>
  );
};
