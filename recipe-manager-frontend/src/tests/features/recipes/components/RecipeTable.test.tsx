import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Recipe } from '../../../../features/recipes/types.ts';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useNavigate } from 'react-router';
import { RecipeTable } from '../../../../features/recipes/components/RecipeTable.tsx';

const mockedUseNavigate = vi.mocked(useNavigate);

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [
    { ingredientName: 'Noodles', quantity: 200, unit: 'g' },
    { ingredientName: 'Salt', quantity: 1, unit: 'tsp' },
  ],
  instructions: 'Boil water and cook noodles.',
  difficulty: 2,
  tags: ['dinner', 'quick'],
};

const renderRecipeTable = (recipeList: Recipe[] = [recipe], onDeleteConfirm = vi.fn()) =>
  render(<RecipeTable recipes={recipeList} onDeleteConfirm={onDeleteConfirm} />);

describe('RecipeTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(vi.fn());
  });

  describe('when there are no recipes', () => {
    it('renders an info alert', () => {
      renderRecipeTable([]);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/no recipes yet/i)).toBeInTheDocument();
    });

    it('does not render the data grid', () => {
      renderRecipeTable([]);

      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('when there are recipes', () => {
    it('renders the data grid', () => {
      renderRecipeTable();

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('does not render an info alert', () => {
      renderRecipeTable();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('displays the recipe name', () => {
      renderRecipeTable();

      expect(screen.getByText('Pasta')).toBeInTheDocument();
    });

    it('displays ingredients as a comma-separated list', () => {
      renderRecipeTable();

      expect(screen.getByText('Noodles, Salt')).toBeInTheDocument();
    });

    it('displays recipe tags as chips', () => {
      renderRecipeTable();

      expect(screen.getByText('dinner')).toBeInTheDocument();
      expect(screen.getByText('quick')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to the recipe details page when a row is clicked', () => {
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);

      renderRecipeTable();

      fireEvent.click(screen.getByText('Pasta'));

      expect(navigateMock).toHaveBeenCalledWith('/recipes/recipe-1');
    });
  });

  describe('delete', () => {
    it('does not show the confirmation dialog by default', () => {
      renderRecipeTable();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens the confirmation dialog with the recipe name when delete is clicked', () => {
      renderRecipeTable();

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getAllByText(/Pasta/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('dialog')).toHaveTextContent('Pasta');
    });

    it('closes the dialog when Cancel is clicked', async () => {
      renderRecipeTable();

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('calls onDeleteConfirm with the recipe and closes the dialog when Delete is confirmed', async () => {
      const onDeleteConfirm = vi.fn();
      renderRecipeTable([recipe], onDeleteConfirm);

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

      expect(onDeleteConfirm).toHaveBeenCalledWith(recipe);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('does not call onDeleteConfirm when Cancel is clicked', () => {
      const onDeleteConfirm = vi.fn();
      renderRecipeTable([recipe], onDeleteConfirm);

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onDeleteConfirm).not.toHaveBeenCalled();
    });
  });
});
