import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Recipe } from '../../../../features/recipes/types.ts';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(),
  };
});

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../../../features/recipes/components/RecipeForm.tsx', () => ({
  RecipeForm: vi.fn(({ recipe }: { recipe?: Recipe }) => (
    <div data-testid="recipe-form">{recipe?.name ?? 'new'}</div>
  )),
}));

import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { RecipeFormPageBody } from '../../../../features/recipes/components/RecipeFormPageBody.tsx';
import { ApiError } from '../../../../shared/apiError.ts';

const mockedUseQuery = vi.mocked(useQuery);
const mockedUseMutation = vi.mocked(useMutation);
const mockedUseQueryClient = vi.mocked(useQueryClient);

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Pasta',
  ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
  instructions: 'Boil water and cook noodles.',
  difficulty: 3,
  tags: ['dinner'],
};

const defaultMutationMock = {
  mutate: vi.fn(),
  isPending: false,
  error: null,
  reset: vi.fn(),
} as unknown as ReturnType<typeof useMutation>;

describe('RecipeFormPageBody', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
    mockedUseMutation.mockReturnValue(defaultMutationMock);
    mockedUseQueryClient.mockReturnValue({ invalidateQueries: vi.fn() } as never);
  });

  describe('in add mode (no recipeId)', () => {
    it('renders RecipeForm without recipe data', () => {
      mockedUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as UseQueryResult);

      render(<RecipeFormPageBody />);

      expect(screen.getByTestId('recipe-form')).toBeInTheDocument();
      expect(screen.getByText('new')).toBeInTheDocument();
    });
  });

  describe('in edit mode (with recipeId)', () => {
    it('shows a spinner while loading', () => {
      mockedUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as UseQueryResult);

      render(<RecipeFormPageBody recipeId="recipe-1" />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByTestId('recipe-form')).not.toBeInTheDocument();
    });

    it('shows an error alert when fetch fails', () => {
      mockedUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed'),
      } as UseQueryResult);

      render(<RecipeFormPageBody recipeId="recipe-1" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/error occurred while fetching/i)).toBeInTheDocument();
    });

    it('shows NotFound when recipe is null', () => {
      mockedUseQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as UseQueryResult);

      render(<RecipeFormPageBody recipeId="recipe-1" />);

      expect(screen.getByRole('heading', { name: /recipe not found/i })).toBeInTheDocument();
    });

    it('renders RecipeForm with the fetched recipe', () => {
      mockedUseQuery.mockReturnValue({
        data: recipe,
        isLoading: false,
        error: null,
      } as UseQueryResult);

      render(<RecipeFormPageBody recipeId="recipe-1" />);

      expect(screen.getByTestId('recipe-form')).toBeInTheDocument();
      expect(screen.getByText('Pasta')).toBeInTheDocument();
    });
  });

  it('shows a spinner when mutation is pending', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as UseQueryResult);
    mockedUseMutation.mockReturnValue({
      ...defaultMutationMock,
      isPending: true,
    } as unknown as ReturnType<typeof useMutation>);

    render(<RecipeFormPageBody />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an error snackbar when mutation fails', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as UseQueryResult);
    mockedUseMutation.mockReturnValue({
      ...defaultMutationMock,
      error: new ApiError('Something went wrong', 500),
    } as unknown as ReturnType<typeof useMutation>);

    render(<RecipeFormPageBody />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
