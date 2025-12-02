import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  // This helps catch misconfiguration during development without hardcoding URLs
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set. Configure it in your .env file, e.g. VITE_API_URL=http://localhost:5000"
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const buildApiUrl = (path) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
};


