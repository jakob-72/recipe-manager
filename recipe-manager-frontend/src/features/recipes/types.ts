export interface Recipe {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  difficulty: number;
  tags: string[];
}

export interface Ingredient {
  ingredientName: string;
  quantity: number;
  unit: string;
}
