import Keycloak from 'keycloak-js';
import { logger } from '../shared/logger.ts';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_IAM_URL,
  realm: import.meta.env.VITE_IAM_REALM,
  clientId: import.meta.env.VITE_IAM_CLIENT_ID,
});

export const getValidToken = async (): Promise<string> => {
  try {
    await keycloak.updateToken(60);
  } catch (e) {
    logger.error('Error updating token - relogin', e);
    await keycloak.login();
  }

  if (!keycloak.token) {
    logger.error('No token available');
    throw new Error('No token available');
  }

  return keycloak.token;
};
