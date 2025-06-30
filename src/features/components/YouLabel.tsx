import { User } from "../../types"
import { MtasUser } from "../../types/mtas-user.type"
import styles from "./Components.module.scss"

export const YouLabel = ({
  authorId,
  currentUserId,
}: {
  authorId: string
  currentUserId: string
}) => {
  return authorId === currentUserId ? (
    <div className={styles.youLabelContainer}>
      <span className={styles.youLabel}>you</span>
    </div>
  ) : null
}
