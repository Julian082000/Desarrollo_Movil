import Constants from "expo-constants";

/**
 * Configuración por ambiente.
 *
 * Expo inyecta en el bundle las variables que empiezan con EXPO_PUBLIC_ leyéndolas de
 * `.env`, `.env.development`, `.env.production`, etc. Deben referenciarse de forma literal
 * (process.env.EXPO_PUBLIC_X), no desestructuradas.
 *
 * ⚠ Todo lo que lleve prefijo EXPO_PUBLIC_ queda visible dentro de la app: nunca pongas secretos aquí.
 */
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

/**
 * Detección automática: cuando abres la app escaneando el QR de Expo, el teléfono ya sabe
 * la IP de tu PC (hostUri = "192.168.1.20:8081"). Reutilizamos esa IP para la API (puerto 3000),
 * así no hay que escribirla en ningún archivo ni cambiarla cuando se renueva.
 */
function detectarHostDelPc(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(":")[0];
  // En modo túnel (--tunnel) el host es público y la API no vive ahí.
  if (!host || host.endsWith(".exp.direct")) return null;
  return host;
}

const hostDetectado = detectarHostDelPc();

/**
 * URL base de library_api, sin "/" final. Prioridad:
 * 1) EXPO_PUBLIC_API_URL si existe en .env (útil para producción, p. ej. Vercel)
 * 2) la IP detectada desde el QR de Expo
 * 3) http://localhost:3000
 */
export const API_URL = (
  rawApiUrl && rawApiUrl.length > 0
    ? rawApiUrl
    : hostDetectado
      ? `http://${hostDetectado}:3000`
      : "http://localhost:3000"
).replace(/\/+$/, "");
/** Tiempo máximo de espera por petición antes de considerarla un fallo de red. */
export const REQUEST_TIMEOUT_MS = 10_000;
