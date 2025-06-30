import styles from "./Users.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById, selectUserIdsOrUndefined } from "./usersSlice"
import { TimeAgo } from "../posts/TimeAgo"
import { YouLabel } from "../components/YouLabel"
import { RiseLoader } from "react-spinners"
import { Link } from "react-router-dom"
import { authServiceLoginUrl } from "../../misc-constant"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

const UserProfileExcerpt = ({ userId }: { userId: string }) => {
  const user = useAppSelector((state) => selectUserById(state, Number(userId)))
  const currentUser = useAppSelector((state) => state.users.currentUser)

  if (!user) return null

  return (
    <div className={styles.userProfileExcerpt}>
      {/* <img
        src={`${frontendBaseUrl}/images/avatars/${user.image.png}`}
        alt="profile pic"
      /> */}
      <img
        src={`${frontendBaseUrl}/images/profile-image-placeholder.png`}
        style={{ width: "86px", height: "86px" }}
        alt="author"
      />

      <div className={styles.userNameRegisterDate}>
        <div className={styles.userNameYouLabelContainer}>
          <span className={styles.userName}>{user.name}</span>
          {currentUser && (
            <YouLabel authorId={user.id} currentUserId={currentUser.id} />
          )}
        </div>
        <div>
          <span className={styles.registered}>Registered: </span>
          <TimeAgo timestamp={user.createdAt} />
        </div>
      </div>
    </div>
  )
}

export const UsersList = () => {
  const usersIds = useAppSelector(selectUserIdsOrUndefined)

  const usersFetchStatus = useAppSelector((state) => state.users.status)

  return (
    <div className={styles.usersListContainer}>
      {usersIds ? (
        usersIds.map((userId) => (
          <UserProfileExcerpt userId={String(userId)} key={userId} />
        ))
      ) : usersFetchStatus === "failed" ? (
        <div
          style={{ flexDirection: "column" }}
          className={styles.notFoundContainer}
        >
          <img
            src={`${frontendBaseUrl}/images/octagon-alert.svg`}
            style={{ width: "50px", height: "50px" }}
            alt="error"
          />
          <div className={styles.unauthorizedLink}>
            <p style={{ margin: "8px" }}>Error fetching users.</p>
            <Link to={authServiceLoginUrl}>
              You need to be logged in to access this page
              <img
                src={`${frontendBaseUrl}/images/external-link.svg`}
                style={{ width: "32px", height: "32px" }}
                alt="arrow"
              />
            </Link>
          </div>
        </div>
      ) : (
        <div
          data-testid="noPostsModal"
          style={{ flexDirection: "column" }}
          className={styles.notFoundContainer}
        >
          <p>
            Loading content. It can take up to a minute since free server is
            used
          </p>
          <div style={{ marginBottom: "16px" }}>
            <RiseLoader color="hsl(212, 24%, 26%)" />
          </div>
        </div>
      )}
    </div>
  )
}
