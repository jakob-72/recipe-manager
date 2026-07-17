import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Recipe } from '../../../../features/recipes/types.ts';
import { RecipeForm } from '../../../../features/recipes/components/RecipeForm.tsx';

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
  instructions: 'Boil water and cook noodles.',
  difficulty: 3,
  tags: ['dinner'],
};

describe('RecipeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty form (no recipe prop)', () => {
    it('renders Save button as disabled', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('disables remove ingredient button when there is only one ingredient row', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      expect(screen.getByRole('button', { name: /remove ingredient/i })).toBeDisabled();
    });

    it('shows "No tags" placeholder', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      expect(screen.getByText(/no tags/i)).toBeInTheDocument();
    });
  });

  describe('with a valid pre-filled recipe', () => {
    it('renders the recipe name', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      expect(screen.getByDisplayValue('Pasta')).toBeInTheDocument();
    });

    it('renders the recipe instructions', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      expect(screen.getByDisplayValue('Boil water and cook noodles.')).toBeInTheDocument();
    });

    it('renders existing tags', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      expect(screen.getByText('dinner')).toBeInTheDocument();
    });

    it('enables Save button', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();
    });

    it('disables Save button when instructions are blank', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText(/describe all preparation steps/i), {
        target: { value: '   ' },
      });

      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('calls onSubmit with the recipe data when Save is clicked', () => {
      const onSubmit = vi.fn();
      render(<RecipeForm recipe={recipe} onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Pasta', difficulty: 3 }),
      );
    });
  });

  describe('tag management', () => {
    it('adds a tag when Add button is clicked', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText(/e.g. vegan/i), {
        target: { value: 'vegan' },
      });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

      expect(screen.getByText('vegan')).toBeInTheDocument();
    });

    it('adds a tag when Enter is pressed in the tag input', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText(/e.g. vegan/i), {
        target: { value: 'quick' },
      });
      fireEvent.keyDown(screen.getByPlaceholderText(/e.g. vegan/i), { key: 'Enter' });

      expect(screen.getByText('quick')).toBeInTheDocument();
    });

    it('disables Add button for a duplicate tag', () => {
      render(<RecipeForm recipe={recipe} onSubmit={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText(/e.g. vegan/i), {
        target: { value: 'dinner' },
      });

      expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
    });

    it('disables Add button when tag input is empty', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
    });
  });

  describe('ingredient management', () => {
    it('adds an ingredient row when "Add ingredient" is clicked', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      expect(screen.getAllByRole('button', { name: /remove ingredient/i })).toHaveLength(1);
      fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
      expect(screen.getAllByRole('button', { name: /remove ingredient/i })).toHaveLength(2);
    });

    it('enables remove button when there are multiple ingredient rows', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));

      screen
        .getAllByRole('button', { name: /remove ingredient/i })
        .forEach((btn) => expect(btn).not.toBeDisabled());
    });

    it('removes an ingredient row when remove is clicked', () => {
      render(<RecipeForm onSubmit={vi.fn()} />);

      fireEvent.click(screen.getByRole('button', { name: /add ingredient/i }));
      expect(screen.getAllByRole('button', { name: /remove ingredient/i })).toHaveLength(2);

      fireEvent.click(screen.getAllByRole('button', { name: /remove ingredient/i })[0]);
      expect(screen.getAllByRole('button', { name: /remove ingredient/i })).toHaveLength(1);
    });
  });
});
