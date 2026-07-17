import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();

  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('../../features/recipes/components/RecipeDetailsPageBody.tsx', () => ({
  RecipeDetailsPageBody: vi.fn(({ recipeId }: { recipeId: string }) => (
    <div data-testid="recipe-details-page-body">Recipe Details Page Body - {recipeId}</div>
  )),
}));

import { useNavigate, useParams } from 'react-router';
import { RecipeDetailsPageBody } from '../../features/recipes/components/RecipeDetailsPageBody.tsx';
import { RecipeDetails } from '../../pages/RecipeDetails.tsx';

const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseParams = vi.mocked(useParams);
const mockedRecipeDetailsPageBody = vi.mocked(RecipeDetailsPageBody);

const renderRecipeDetailsPage = () => {
  render(<RecipeDetails />);
};

describe('RecipeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(vi.fn());
  });

  it('renders NotFound when no recipeId is present in route params', () => {
    mockedUseParams.mockReturnValue({});

    renderRecipeDetailsPage();

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-details-page-body')).not.toBeInTheDocument();
  });

  it('renders RecipeDetailsPageBody when recipeId is present in route params', () => {
    mockedUseParams.mockReturnValue({ id: '123' });

    renderRecipeDetailsPage();

    expect(screen.getByTestId('recipe-details-page-body')).toBeInTheDocument();
    expect(mockedRecipeDetailsPageBody).toHaveBeenCalledWith({ recipeId: '123' }, undefined);
  });
});
