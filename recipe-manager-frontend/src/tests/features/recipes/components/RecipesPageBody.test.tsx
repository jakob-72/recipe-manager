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

vi.mock('../../../../features/recipes/components/RecipeTable.tsx', () => ({
  RecipeTable: vi.fn(
    ({
      recipes,
      onDeleteConfirm,
    }: {
      recipes: Recipe[];
      onDeleteConfirm: (recipe: Recipe) => void;
    }) => (
      <div data-testid="recipe-table" onClick={() => onDeleteConfirm(recipes[0])}>
        RecipeTable - {recipes.length} recipes
      </div>
    ),
  ),
}));

import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { RecipeTable } from '../../../../features/recipes/components/RecipeTable.tsx';
import { RecipesPageBody } from '../../../../features/recipes/components/RecipesPageBody.tsx';
import { MemoryRouter } from 'react-router';
import { fireEvent } from '@testing-library/react';

const mockedUseQuery = vi.mocked(useQuery);
const mockedUseMutation = vi.mocked(useMutation);
const mockedUseQueryClient = vi.mocked(useQueryClient);
const mockedRecipeTable = vi.mocked(RecipeTable);

const recipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Pasta',
    ingredients: [{ ingredientName: 'Noodles', quantity: 200, unit: 'g' }],
    instructions: 'Boil water and cook noodles.',
    difficulty: 2,
    tags: ['dinner'],
  },
];

const renderRecipesPageBody = () =>
  render(
    <MemoryRouter>
      <RecipesPageBody />
    </MemoryRouter>,
  );

const mockMutateFn = vi.fn();

const defaultMutationMock = {
  mutate: mockMutateFn,
  isPending: false,
  isError: false,
  isSuccess: false,
  reset: vi.fn(),
} as unknown as ReturnType<typeof useMutation>;

describe('RecipesPageBody', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseMutation.mockReturnValue(defaultMutationMock);
    mockedUseQueryClient.mockReturnValue({ invalidateQueries: vi.fn() } as never);
  });

  it('renders a loading spinner while fetching recipes', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as UseQueryResult);

    renderRecipesPageBody();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-table')).not.toBeInTheDocument();
  });

  it('renders an error alert when the query fails', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
    } as UseQueryResult);

    renderRecipesPageBody();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/an error occurred while fetching recipes/i)).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-table')).not.toBeInTheDocument();
  });

  it('renders an error alert when data is undefined', () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as UseQueryResult);

    renderRecipesPageBody();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/an error occurred while fetching recipes/i)).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-table')).not.toBeInTheDocument();
  });

  it('renders the RecipeTable and add button when recipes are fetched successfully', () => {
    mockedUseQuery.mockReturnValue({
      data: recipes,
      isLoading: false,
      error: null,
    } as UseQueryResult);

    renderRecipesPageBody();

    expect(screen.getByTestId('recipe-table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('passes fetched recipes to RecipeTable', () => {
    mockedUseQuery.mockReturnValue({
      data: recipes,
      isLoading: false,
      error: null,
    } as UseQueryResult);

    renderRecipesPageBody();

    expect(mockedRecipeTable).toHaveBeenCalledWith(expect.objectContaining({ recipes }), undefined);
  });

  it('calls deleteMutation.mutate with the recipe when onDeleteConfirm is triggered', () => {
    mockedUseQuery.mockReturnValue({
      data: recipes,
      isLoading: false,
      error: null,
    } as UseQueryResult);

    renderRecipesPageBody();

    fireEvent.click(screen.getByTestId('recipe-table'));

    expect(mockMutateFn).toHaveBeenCalledWith(recipes[0]);
  });
});
