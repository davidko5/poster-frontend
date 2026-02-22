export function authFetch(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      ...init?.headers,
    },
  })
}
