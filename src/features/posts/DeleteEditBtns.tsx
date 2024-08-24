import styles from "./Posts.module.scss"

export const DeleteEditBtns = ({
  onDeleteClicked,
  onEditClicked,
}: {
  onDeleteClicked: () => void
  onEditClicked: () => void
}) => {
  return (
    <div className={styles.deleteEditBtnsContainer}>
      <div
        data-testid="deleteBtn"
        className={styles.deleteBtn}
        onClick={onDeleteClicked}
      >
        <span className={styles.deleteIcon}></span>
        <span>Delete</span>
      </div>
      <div
        data-testid="editBtn"
        className={styles.editBtn}
        onClick={onEditClicked}
      >
        <span className={styles.editIcon}></span>
        <span>Edit</span>
      </div>
    </div>
  )
}
