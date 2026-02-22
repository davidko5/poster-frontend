import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logout, selectCurrentUser } from "../users/usersSlice"
import { authServiceLoginUrl, frontendBaseUrl } from "../../misc-constant"
import { AboutModal } from "./AboutModal"

export const Navbar = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  const [aboutOpen, setAboutOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <nav className={styles.navbarContainer}>
        <a className={styles.logoSection} href={`${frontendBaseUrl}/posts`}>
          <h1 className={styles.logoText}>Poster</h1>
        </a>

        <a
          href="https://github.com/davidko5/poster-frontend"
          target="_blank"
          className={styles.githubLink}
        >
          <img
            src={`${frontendBaseUrl}/images/github-mark.svg`}
            alt="GitHub"
          />
        </a>

        <div className={styles.navLinks}>
          <div className={styles.navBarLink}>
            <Link to={`${frontendBaseUrl}/posts`}>Posts</Link>
          </div>
          <div className={styles.navBarLink}>
            <Link to={`${frontendBaseUrl}/users`}>Users</Link>
          </div>
        </div>

        {!currentUser && (
          <div className={styles.navBarMessage}>
            🔒 View only — sign in to join the conversation
          </div>
        )}

        <div className={styles.navRightSection}>
          <button className={styles.aboutBtn} onClick={() => setAboutOpen(true)}>
            About
          </button>

          {currentUser ? (
            <>
              <div className={styles.navBarInfo}>{currentUser.name}</div>
              <button className={styles.navBarButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to={authServiceLoginUrl} className={styles.loginLink}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
  )
}
