export const frontendBaseUrl = "/poster-frontend"

export const isDev = import.meta.env.DEV

export const backendUrl = !isDev
  ? "http://localhost:5012"
  : "https://express.kondraten.dev"

export const authServiceBackendUrl = isDev
  ? "http://localhost:5010"
  : "https://mtas-api.kondraten.dev"

export const appId = import.meta.env.VITE_APP_ID

const redirectUri = `${import.meta.env.VITE_REDIRECT_URI}/auth/callback`

export const authServiceLoginUrl = isDev
  ? `http://localhost:5011/user/login?redirectUri=${redirectUri}&appId=${appId}`
  : `https://mtas-ui.kondraten.dev/user/login?redirectUri=${redirectUri}&appId=${appId}`
