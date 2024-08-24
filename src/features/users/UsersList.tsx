import styles from "./Users.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUsersIds, selectUserById } from "./usersSlice"
import { TimeAgo } from "../posts/TimeAgo"
import { YouLabel } from "../components/YouLabel"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const UsersList = () => {
  const usersIds = useAppSelector(selectUsersIds)
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
      {usersIds.map((userId) => (
        <UserProfileExcerpt userId={String(userId)} key={userId} />
      ))}
    </div>
  )
}
