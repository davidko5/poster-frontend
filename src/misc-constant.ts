export const frontendBaseUrl = "/poster-frontend"

export const isDev = import.meta.env.DEV

export const backendUrl = isDev
  ? "http://localhost:5012"
  : "https://davidko5-express.onrender.com"

export const authServiceBackendUrl = isDev
  ? "http://localhost:5010"
  : "https://mtas.kondraten.dev/api"

export const appId = import.meta.env.VITE_APP_ID

const appUrl = isDev
  ? "http://localhost:5173/poster-frontend"
  : "https://davidko5.github.io/poster-frontend"

export const authServiceLoginUrl = isDev
  ? `http://localhost:5011/user/login?redirectUri=${appUrl}/posts&appId=${appId}`
  : `https://multi-tenant-auth-service-mtas-ui.vercel.app/user-auth/login?redirectUri=${appUrl}/posts&appId=${appId}`
