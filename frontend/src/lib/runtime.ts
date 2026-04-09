const explicitApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const prodApiUrl = (import.meta.env.VITE_API_URL_PROD as string | undefined)?.trim();

export const API_BASE_URL = (explicitApiUrl || (import.meta.env.DEV ? "http://localhost:3000" : prodApiUrl || ""))
  .replace(/\/$/, "");
