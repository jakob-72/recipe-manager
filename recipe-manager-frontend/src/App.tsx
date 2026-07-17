import { keycloak } from './auth/keycloakWrapper.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Page } from './components/Page.tsx';
import { Home } from './pages/Home.tsx';
import { Authenticated } from './auth/Authenticated.tsx';
import { Recipes } from './pages/Recipes.tsx';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { RecipeDetails } from './pages/RecipeDetails.tsx';
import { NotFound } from './components/NotFound.tsx';
import { AddRecipe } from './pages/AddRecipe.tsx';
import { EditRecipe } from './pages/EditRecipe.tsx';

export const App = () => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <QueryClientProvider client={new QueryClient()}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path={'/'} element={<Page content={<Home />} />} />
            <Route
              path={'/recipes'}
              element={
                <Authenticated>
                  <Page content={<Recipes />} />
                </Authenticated>
              }
            />
            <Route
              path={'/recipes/:id'}
              element={
                <Authenticated>
                  <Page content={<RecipeDetails />} />
                </Authenticated>
              }
            />
            <Route
              path={'/recipes/:id/edit'}
              element={
                <Authenticated>
                  <Page content={<EditRecipe />} />
                </Authenticated>
              }
            />
            <Route
              path={'/add-recipe'}
              element={
                <Authenticated>
                  <Page content={<AddRecipe />} />
                </Authenticated>
              }
            />
            <Route path="*" element={<Page content={<NotFound />} />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
};
