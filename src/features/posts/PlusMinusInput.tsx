import styles from "./Posts.module.scss"

export const PlusMinusInput = ({
  score,
  onPlusMinusClickHandler,
  disabled,
}: {
  score: number
  onPlusMinusClickHandler: (valueToIncrement: number) => void
  disabled: boolean
}) => {
  return (
    <div className={styles.plusMinusInputContainer}>
      <div
        data-testid="plusContainer"
        className={styles.iconContainer}
        onClick={() => !disabled && onPlusMinusClickHandler(1)}
        style={{
          cursor: disabled ? "default" : "pointer",
        }}
      >
        <div
          data-testid="plusIcon"
          className={styles.iconPlus}
          style={{
            backgroundImage: disabled ? "url(/images/icon-plus.svg)" : "",
            cursor: disabled ? "default" : "pointer",
          }}
        />
      </div>
      <div data-testid="scoreContainer" className={styles.plusMinusInputScore}>
        {score}
      </div>
      <div
        data-testid="minusContainer"
        className={styles.iconContainer}
        onClick={() => !disabled && onPlusMinusClickHandler(-1)}
        style={{
          cursor: disabled ? "default" : "pointer",
        }}
      >
        <div
          className={styles.iconMinus}
          style={{
            backgroundImage: disabled ? "url(/images/icon-minus.svg)" : "",
          }}
        />
      </div>
    </div>
  )
}
