import styles from "./Components.module.scss"
import { Author } from "../../utils/types"

export const YouLabel = ({
  entity,
  currentUser,
}: {
  entity: { author: Author }
  currentUser: string
}) => {
  return entity.author._id === currentUser ? (
    <div className={styles.youLabelContainer}>
      <span className={styles.youLabel}>you</span>
    </div>
  ) : null
}
