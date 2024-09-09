import styles from "./Components.module.scss"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"
import { useRef, useState, useEffect } from "react"

const refFocus = (ref: any) => {
  ref.current && ref.current.focus()
}

export const DeleteModal = ({
  //   modalContainerRef,
  setModalOpened,
  onConfirmation,
  titleText,
  cancelBtnText,
  confirmBtnText,
}: {
  //   modalContainerRef: React.RefObject<HTMLDivElement>
  setModalOpened: React.Dispatch<React.SetStateAction<boolean>>
  onConfirmation: () => void
  titleText: string
  cancelBtnText: string
  confirmBtnText: string
}) => {
  const modalContainerRef = useRef(null)

  useOutsideAlerter(modalContainerRef, () => {
    setModalOpened(false)
  })

  const ctrlEnterConfirmation = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      onConfirmation && onConfirmation()
      textareaRef.current && textareaRef.current.blur()
      setModalOpened(false)
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    refFocus(textareaRef)
  })

  return (
    <div
      className={styles.deleteModalContainer}
      onKeyDown={ctrlEnterConfirmation}
    >
      <div ref={modalContainerRef} className={styles.deleteModal}>
        <h2>{titleText}</h2>
        <p>
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className={styles.btnsContainer}>
          <button
            className={styles.cancellationBtn}
            onClick={() => {
              setModalOpened(false)
            }}
          >
            {cancelBtnText}
          </button>
          <button
            data-testid="deleteModalConfirmationBtn"
            className={styles.confirmationBtn}
            onClick={() => {
              onConfirmation && onConfirmation()
              setModalOpened(false)
            }}
          >
            {confirmBtnText}
          </button>
        </div>
      </div>
    </div>
  )
}
