import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: vi.fn(), useParams: vi.fn() };
});

vi.mock('../../features/recipes/components/RecipeFormPageBody.tsx', () => ({
  RecipeFormPageBody: vi.fn(({ recipeId }: { recipeId?: string }) => (
    <div data-testid="recipe-form-page-body">{recipeId}</div>
  )),
}));

import { useNavigate, useParams } from 'react-router';
import { EditRecipe } from '../../pages/EditRecipe.tsx';

describe('EditRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('renders NotFound when no id is in route params', () => {
    vi.mocked(useParams).mockReturnValue({});

    render(<EditRecipe />);

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-form-page-body')).not.toBeInTheDocument();
  });

  it('renders the "Edit Recipe" heading when id is present', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'recipe-1' });

    render(<EditRecipe />);

    expect(screen.getByRole('heading', { name: /edit recipe/i })).toBeInTheDocument();
  });

  it('renders RecipeFormPageBody with the recipeId from params', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'recipe-1' });

    render(<EditRecipe />);

    expect(screen.getByTestId('recipe-form-page-body')).toBeInTheDocument();
    expect(screen.getByText('recipe-1')).toBeInTheDocument();
  });
});
