import { useAuth } from '../auth/useAuth.ts';
import { Navigate } from 'react-router';
import { Button, Typography } from '@mui/material';

export const Home = () => {
  const { authenticated, login } = useAuth();

  if (authenticated) {
    return <Navigate to={'/recipes'} replace />;
  }

  return (
    <>
      <Typography variant="h4" component="h1">
        Welcome to Recipe Manager
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Sign in to browse, create, and manage your recipes.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => {
          login(`${window.location.origin}/recipes`);
        }}
        sx={{ width: '100%', maxWidth: 480 }}
      >
        Log in
      </Button>
    </>
  );
};
