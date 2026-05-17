// Vite injects BASE_URL with trailing slash ("/" or "/poster-frontend/").
// Strip trailing slash so callers can do `${frontendBaseUrl}/posts` without doubling.
const rawBase = import.meta.env.BASE_URL
export const frontendBaseUrl = rawBase === "/" ? "" : rawBase.replace(/\/$/, "")

export const isDev = import.meta.env.DEV

export const backendUrl = import.meta.env.VITE_BACKEND_URL

export const loginUrl = `${backendUrl}/auth/login`
