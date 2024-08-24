import { User } from "../../types"
import styles from "./Components.module.scss"

export const YouLabel = ({
  entity,
  currentUser,
}: {
  entity: { author: User }
  currentUser: string
}) => {
  return entity.author._id === currentUser ? (
    <div className={styles.youLabelContainer}>
      <span className={styles.youLabel}>you</span>
    </div>
  ) : null
}
