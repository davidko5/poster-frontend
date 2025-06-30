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
  disabled?: boolean
}

export const ReplyInput = (props: ReplyInputProps) => {
  const {
    placeholder,
    textareaRef,
    btnText,
    onClickOutside,
    onSendClick,
    disabled = false,
  } = props

  const [textareaValue, setTextareaValue] = useState("")
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
    if (disabled) return

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
        // <img
        //   src={`${frontendBaseUrl}/images/avatars/${currentUser?.image.png}`}
        //   alt="author"
        // />
        <img
          src={`${frontendBaseUrl}/images/profile-image-placeholder.png`}
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
        style={{
          padding: "10px",
          opacity: disabled ? 0.5 : 1,
        }}
        disabled={disabled}
      />
      {windowSize.width > 600 && (
        <div
          data-testid="replyInputBtn"
          className={styles.replyInputBtn}
          onClick={handleConfirmation}
          style={{
            backgroundColor: disabled ? "hsl(239, 57%, 85%)" : "",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          <span>{btnText}</span>
        </div>
      )}
      {windowSize.width < 600 && (
        <div className={styles.imageConfirmBtn}>
          {/* <img
            src={`${frontendBaseUrl}/images/avatars/${currentUser?.image.png}`}
            alt="author"
          /> */}
          <img
            src={`${frontendBaseUrl}/images/profile-image-placeholder.png`}
            alt="author"
          />
          <div
            className={styles.replyInputBtn}
            onClick={handleConfirmation}
            style={{
              backgroundColor: disabled ? "hsl(239, 57%, 85%)" : "",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <span>{btnText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
