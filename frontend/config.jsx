export const BACKEND_URL =
  import.meta.env.DEV
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;