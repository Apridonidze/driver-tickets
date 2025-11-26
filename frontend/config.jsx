export const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.REACT_APP_BACKEND_URL;