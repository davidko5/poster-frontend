import styles from "./Posts.module.scss"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"
import { useRef, useState, useEffect } from "react"

const refFocus = (ref: any) => {
  ref.current && ref.current.focus()
}

export const TextareaModal = ({
  modalContainerRef,
  setIsModalOpened,
  onConfirmation,
  confirmBtnText,
}: {
  modalContainerRef: React.RefObject<HTMLDivElement>
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
  onConfirmation: (content: string) => void
  confirmBtnText: string
}) => {
  const [textareaValue, setTextareaValue] = useState("")

  useOutsideAlerter(modalContainerRef, () => {
    setIsModalOpened(false)
  })

  const ctrlEnterConfirmation = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      onConfirmation && onConfirmation(textareaValue)
      textareaRef.current && textareaRef.current.blur()
      setIsModalOpened(false)
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    refFocus(textareaRef)
  })

  return (
    <div className={styles.textareaModalContainer}>
      <div ref={modalContainerRef} className={styles.textareaModal}>
        <textarea
          data-testid="addPostTextarea"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          ref={textareaRef}
          placeholder={"What is on your mind ?"}
          onKeyDown={ctrlEnterConfirmation}
          style={{
            padding: "10px",
          }}
        />
        <button
          className={styles.confirmationBtn}
          onClick={() => {
            onConfirmation && onConfirmation(textareaValue)
            setIsModalOpened(false)
          }}
        >
          {confirmBtnText}
        </button>
      </div>
    </div>
  )
}
