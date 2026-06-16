import Constants from 'expo-constants';

// URL base da API. Ordem de precedencia:
//   1. variavel de ambiente EXPO_PUBLIC_API_URL (arquivo .env)
//   2. app.json -> expo.extra.apiBaseUrl
//   3. fallback localhost
export const DEFAULT_API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  'http://localhost:3333/api/v1';
