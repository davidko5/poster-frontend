// Vite injects BASE_URL with trailing slash ("/" or "/poster-frontend/").
// Strip trailing slash so callers can do `${frontendBaseUrl}/posts` without doubling.
const rawBase = import.meta.env.BASE_URL
export const frontendBaseUrl = rawBase === "/" ? "" : rawBase.replace(/\/$/, "")

export const isDev = import.meta.env.DEV

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const authServiceBackendUrl = import.meta.env.VITE_AUTH_API_URL

export const appId = import.meta.env.VITE_APP_ID

const redirectUri = `${import.meta.env.VITE_REDIRECT_URI}/auth/callback`
const authUiUrl = import.meta.env.VITE_AUTH_UI_URL

export const authServiceLoginUrl = `${authUiUrl}/user/login?redirectUri=${redirectUri}&appId=${appId}`
