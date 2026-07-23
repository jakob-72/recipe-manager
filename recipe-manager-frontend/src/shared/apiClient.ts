import { getValidToken } from '../auth/keycloakWrapper.ts';
import { ApiError } from './apiError.ts';
import { logger } from './logger.ts';

const baseUrl = import.meta.env.VITE_API_URL;

export const get = async <T>(path: string): Promise<T> => {
  const token = await getValidToken();

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.warn(`API request failed: ${response.status} ${errorText || response.statusText}`);
    throw new ApiError(errorText || response.statusText, response.status);
  }

  return response.json();
};

export const post = async <TResponse, TBody = TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> => sendData<TResponse, TBody>(path, body, 'POST');

export const put = async <TResponse, TBody = TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> => sendData<TResponse, TBody>(path, body, 'PUT');

export const deleteRequest = async (path: string): Promise<void> => {
  const token = await getValidToken();

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.warn(`API request failed: ${response.status} ${errorText || response.statusText}`);
    throw new ApiError(errorText || response.statusText, response.status);
  }
};

const sendData = async <TResponse, TBody>(
  path: string,
  body: TBody,
  method: 'POST' | 'PUT',
): Promise<TResponse> => {
  const token = await getValidToken();

  const response = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.warn(`API request failed: ${response.status} ${errorText || response.statusText}`);
    throw new ApiError(errorText || response.statusText, response.status);
  }

  return response.json();
};
