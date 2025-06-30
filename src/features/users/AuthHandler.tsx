import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../app/hooks"
import { exchangeAuthCodeForToken } from "./usersSlice"

export function AuthHandler() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get("auth_code")
    if (!code) return

    const redirectUri = window.location.origin + window.location.pathname
    const appId = import.meta.env.VITE_APP_ID

    dispatch(exchangeAuthCodeForToken({ authCode: code, appId, redirectUri }))
      .unwrap()
      .then(() => {
        // clear the param so you don’t re-exchange on future navigations
        searchParams.delete("auth_code")
        setSearchParams(searchParams, { replace: true })
        // navigate("/", { replace: true })
      })
  }, [dispatch, navigate, searchParams, setSearchParams])

  return null
}
