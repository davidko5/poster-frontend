export const frontendBaseUrl = "/poster-frontend"

export const isDev = import.meta.env.DEV

export const backendUrl = isDev
  ? "http://localhost:5012"
  : "https://davidko5-express.onrender.com"

export const authServiceBackendUrl = isDev
  ? "http://localhost:5010"
  : "https://mtas-api.kondraten.dev"

export const appId = import.meta.env.VITE_APP_ID

const appUrl = isDev
  ? "http://localhost:5173/poster-frontend"
  : "https://davidko5.github.io/poster-frontend"

export const authServiceLoginUrl = isDev
  ? `http://localhost:5011/user/login?redirectUri=${appUrl}/posts&appId=${appId}`
  : `https://mtas-ui.kondraten.dev/user/login?redirectUri=${appUrl}/posts&appId=${appId}`
