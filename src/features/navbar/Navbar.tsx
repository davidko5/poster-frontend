import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logout, selectCurrentUser } from "../users/usersSlice"
import { authServiceLoginUrl, frontendBaseUrl } from "../../misc-constant"

export const Navbar = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className={styles.navbarContainer}>
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 className={styles.logoHeader}>Poster</h1>
          <a href="https://github.com/davidko5/poster-frontend" target="_blank">
            <img
              src="/images/github-mark.svg"
              alt="github link"
              className={styles.githubLink}
            />
          </a>
        </div>
        <h2 className={styles.logoHeader}>
          Made using React, Redux, Express and MongoDB{" · "}
          <a
            href="https://github.com/davidko5/multi-tenant-auth-service"
            target="_blank"
            className={styles.mtasLink}
          >
            Auth by MTAS
          </a>
        </h2>
        <div className={styles.navBtnsAndSelectContainer}>
          <div style={{ display: "flex" }}>
            <div className={styles.navBarLink}>
              <Link to={`${frontendBaseUrl}/posts`}>Posts</Link>
            </div>
            <div className={styles.navBarLink}>
              <Link to={`${frontendBaseUrl}/users`}>Users</Link>
            </div>
          </div>
          {!currentUser && (
            <div className={styles.navBarMessage}>
              🔒 You're in view only mode. Sign in to see real users nicknames
              and join the conversation.
            </div>
          )}
          {currentUser ? (
            <div style={{ display: "flex" }}>
              <div className={styles.navBarInfo}>{currentUser.name}</div>
              <button className={styles.navBarButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.navBarLink}>
              <Link to={authServiceLoginUrl}>Login</Link>
            </div>
          )}
        </div>
      </section>
    </nav>
  )
}
