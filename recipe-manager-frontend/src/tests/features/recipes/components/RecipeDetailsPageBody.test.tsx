import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Recipe } from '../../../../features/recipes/types.ts';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return { ...actual, useQuery: vi.fn() };
});

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../../../features/recipes/components/RecipeDetailsTable.tsx', () => ({
  RecipeDetailsTable: vi.fn(({ recipe }: { recipe: Recipe }) => (
    <div data-testid="recipe-details-table">{recipe.name}</div>
  )),
}));

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { RecipeDetailsPageBody } from '../../../../features/recipes/components/RecipeDetailsPageBody.tsx';

const mockedUseQuery = vi.mocked(useQuery);

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
  instructions: 'Boil water and cook noodles.',
  difficulty: 3,
  tags: ['dinner'],
};

describe('RecipeDetailsPageBody', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('shows a spinner while loading', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as UseQueryResult);

    render(<RecipeDetailsPageBody recipeId="recipe-1" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-details-table')).not.toBeInTheDocument();
  });

  it('shows an error alert when fetch fails', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed'),
    } as UseQueryResult);

    render(<RecipeDetailsPageBody recipeId="recipe-1" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/error occurred while fetching/i)).toBeInTheDocument();
  });

  it('shows NotFound when no data is returned', () => {
    mockedUseQuery.mockReturnValue({ data: null, isLoading: false, error: null } as UseQueryResult);

    render(<RecipeDetailsPageBody recipeId="recipe-1" />);

    expect(screen.getByRole('heading', { name: /recipe not found/i })).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-details-table')).not.toBeInTheDocument();
  });

  it('renders RecipeDetailsTable with the fetched recipe', () => {
    mockedUseQuery.mockReturnValue({
      data: recipe,
      isLoading: false,
      error: null,
    } as UseQueryResult);

    render(<RecipeDetailsPageBody recipeId="recipe-1" />);

    expect(screen.getByTestId('recipe-details-table')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });
});
