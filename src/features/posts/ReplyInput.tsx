import React, { useEffect, useRef, useState } from "react"
import styles from "./Posts.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../users/usersSlice"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"

const frontentBaseUrl = import.meta.env.VITE_BASE_URL

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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

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

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div className={styles.replyInputContainer} ref={componentContainerRef}>
      {windowSize.width > 600 && (
        <img
          src={`${frontentBaseUrl}/images/avatars/${currentUser.image.png}`}
          alt="author"
        />
      )}
      <textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        ref={textareaRef}
        placeholder={placeholder}
        onKeyDown={ctrlEnterConfirmation}
      ></textarea>
      {windowSize.width > 600 && (
        <div
          className={styles.replyInputBtn}
          onClick={() => {
            onSendClick && onSendClick(textareaValue)
          }}
        >
          <span>{btnText}</span>
        </div>
      )}
      {windowSize.width < 600 && (
        <div className={styles.imageConfirmBtn}>
          <img
            src={`${frontentBaseUrl}/images/avatars/${currentUser.image.png}`}
            alt="author"
          />
          <div
            className={styles.replyInputBtn}
            onClick={() => {
              onSendClick && onSendClick(textareaValue)
            }}
          >
            <span>{btnText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
