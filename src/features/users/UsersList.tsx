import styles from "./Users.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById, selectUserIdsOrUndefined } from "./usersSlice"
import { TimeAgo } from "../posts/TimeAgo"
import { YouLabel } from "../components/YouLabel"
import { RiseLoader } from "react-spinners"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const UsersList = () => {
  const usersIds = useAppSelector(selectUserIdsOrUndefined)
  const currentUser = useAppSelector((state) => state.users.currentUser)

  const UserProfileExcerpt = ({ userId }: { userId: string }) => {
    const user = useAppSelector((state) => selectUserById(state, userId))
    if (!user) return null

    return (
      <div className={styles.userProfileExcerpt}>
        <img
          src={`${frontendBaseUrl}/images/avatars/${user.image.png}`}
          alt="profile pic"
        />

        <div className={styles.userNameRegisterDate}>
          <div className={styles.userNameYouLabelContainer}>
            <span className={styles.userName}>{user.userName}</span>
            <YouLabel entity={{ author: user }} currentUser={currentUser} />
          </div>
          <div>
            <span className={styles.registered}>Registered: </span>
            <TimeAgo timestamp={user.createdAt} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.usersListContainer}>
      {usersIds ? (
        usersIds.map((userId) => (
          <UserProfileExcerpt userId={String(userId)} key={userId} />
        ))
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
