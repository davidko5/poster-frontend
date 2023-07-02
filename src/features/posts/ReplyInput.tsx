import React, { useEffect, useRef, useState } from "react"
import styles from "./Posts.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../users/usersSlice"

function useOutsideAlerter(
  ref: React.RefObject<HTMLTextAreaElement>,
  onClickOutside?: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

export const ReplyInput = ({
  placeholder,
  textareaRef,
  btnText,
  onClickOutside,
  onSendClick,
}: {
  placeholder: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  btnText: string
  onClickOutside?: () => void
  onSendClick?: (content: string) => void
}) => {
  const [textareaValue, setTextareaValue] = useState("")
  const currentUserId = useAppSelector((state) => state.users.currentUser)
  const currentUser = useAppSelector((state) =>
    selectUserById(state, currentUserId),
  )
  const componentContainerRef = useRef(null)

  const ctrlEnterConfirmation = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      onSendClick && onSendClick(textareaValue)
      setTextareaValue("")
      textareaRef.current && textareaRef.current.blur()
    }
  }

  useOutsideAlerter(componentContainerRef, onClickOutside)

  return (
    <div className={styles.replyInputContainer} ref={componentContainerRef}>
      <img src={`/images/avatars/${currentUser.image.png}`} alt="author" />
      <textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        ref={textareaRef}
        placeholder={placeholder}
        onKeyDown={ctrlEnterConfirmation}
      ></textarea>
      <div
        className={styles.replyInputBtn}
        onClick={() => {
          onSendClick && onSendClick(textareaValue)
        }}
      >
        <span>{btnText}</span>
      </div>
    </div>
  )
}
