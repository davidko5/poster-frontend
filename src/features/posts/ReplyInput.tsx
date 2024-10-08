import React, { useEffect, useRef, useState } from "react"
import styles from "./Posts.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../users/usersSlice"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

interface ReplyInputProps {
  placeholder: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  btnText: string
  onClickOutside?: () => void
  onSendClick?: (content: string) => void
}

export const ReplyInput = (props: ReplyInputProps) => {
  const { placeholder, textareaRef, btnText, onClickOutside, onSendClick } =
    props

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

  const handleConfirmation = () => {
    onSendClick && onSendClick(textareaValue)
    setTextareaValue("")
  }

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
    <div
      data-testid="replyInput"
      className={styles.replyInputContainer}
      ref={componentContainerRef}
    >
      {windowSize.width > 600 && (
        <img
          src={`${frontendBaseUrl}/images/avatars/${currentUser?.image.png}`}
          alt="author"
        />
      )}
      <textarea
        data-testid="replyInputTextarea"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        ref={textareaRef}
        placeholder={placeholder}
        onKeyDown={ctrlEnterConfirmation}
      />
      {windowSize.width > 600 && (
        <div
          data-testid="replyInputBtn"
          className={styles.replyInputBtn}
          onClick={handleConfirmation}
        >
          <span>{btnText}</span>
        </div>
      )}
      {windowSize.width < 600 && (
        <div className={styles.imageConfirmBtn}>
          <img
            src={`${frontendBaseUrl}/images/avatars/${currentUser?.image.png}`}
            alt="author"
          />
          <div
            className={styles.replyInputBtn}
            onClick={() => {
              onSendClick && onSendClick(textareaValue)
              setTextareaValue("")
            }}
          >
            <span>{btnText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
