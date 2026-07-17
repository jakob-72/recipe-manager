import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Recipe } from '../../../../features/recipes/types.ts';
import { RecipeDetailsTable } from '../../../../features/recipes/components/RecipeDetailsTable.tsx';

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
  instructions: 'Boil water and cook noodles.',
  difficulty: 3,
  tags: ['dinner'],
};

const renderTable = (r: Recipe = recipe, onEdit = vi.fn()) =>
  render(<RecipeDetailsTable recipe={r} onEdit={onEdit} />);

describe('RecipeDetailsTable', () => {
  it('renders the recipe name', () => {
    renderTable();

    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });

  it('renders ingredient details', () => {
    renderTable();

    expect(screen.getByText(/Noodles: 200 g/)).toBeInTheDocument();
  });

  it('renders the instructions', () => {
    renderTable();

    expect(screen.getByText('Boil water and cook noodles.')).toBeInTheDocument();
  });

  it('renders tags as chips', () => {
    renderTable();

    expect(screen.getByText('dinner')).toBeInTheDocument();
  });

  it('shows "No tags" when recipe has no tags', () => {
    renderTable({ ...recipe, tags: [] });

    expect(screen.getByText(/no tags/i)).toBeInTheDocument();
  });

  it('shows "No ingredients" when recipe has no ingredients', () => {
    renderTable({ ...recipe, ingredients: [] });

    expect(screen.getByText(/no ingredients/i)).toBeInTheDocument();
  });

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = vi.fn();
    renderTable(recipe, onEdit);

    fireEvent.click(screen.getByRole('button', { name: /edit recipe/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
