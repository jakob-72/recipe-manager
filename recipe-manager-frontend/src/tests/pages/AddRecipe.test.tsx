import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../features/recipes/components/RecipeFormPageBody.tsx', () => ({
  RecipeFormPageBody: vi.fn(({ recipeId }: { recipeId?: string }) => (
    <div data-testid="recipe-form-page-body">{recipeId ?? 'no-id'}</div>
  )),
}));

import { useNavigate } from 'react-router';
import { AddRecipe } from '../../pages/AddRecipe.tsx';

describe('AddRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('renders the "Add Recipe" heading', () => {
    render(<AddRecipe />);

    expect(screen.getByRole('heading', { name: /add recipe/i })).toBeInTheDocument();
  });

  it('renders RecipeFormPageBody without a recipeId', () => {
    render(<AddRecipe />);

    expect(screen.getByTestId('recipe-form-page-body')).toBeInTheDocument();
    expect(screen.getByText('no-id')).toBeInTheDocument();
  });
});
