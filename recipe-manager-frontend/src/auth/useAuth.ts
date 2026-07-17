import { useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';

type AuthState = {
  authenticated: boolean;
  username?: string;
  login: (redirectUri: string) => void;
  logout: () => void;
};

export const useAuth = (): AuthState => {
  const { keycloak } = useKeycloak();
  const authenticated = keycloak.authenticated;
  const username = (keycloak.tokenParsed as Record<string, string> | undefined)?.preferred_username;
  const login = useCallback(
    async (redirectUri: string) => {
      await keycloak.login({ redirectUri });
    },
    [keycloak],
  );
  const logout = useCallback(async () => {
    await keycloak.logout();
  }, [keycloak]);

  return { authenticated, username, login, logout };
};
