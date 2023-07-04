import styles from "./Users.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUsersIds, selectUserById } from "./usersSlice"
import { TimeAgo } from "../posts/TimeAgo"

export const UsersList = () => {
  const usersIds = useAppSelector(selectUsersIds)

  const UserProfileExcerpt = ({ userId }: { userId: string }) => {
    const user = useAppSelector((state) => selectUserById(state, userId))
    return (
      <div className={styles.userProfileExcerpt}>
        <img src={`/images/avatars/${user.image.png}`} alt="profile pic" />

        <div className={styles.userNameRegisterDate}>
          <div className={styles.userName}>{user.userName}</div>
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
        <UserProfileExcerpt userId={String(userId)} />
      ))}
    </div>
  )
}
