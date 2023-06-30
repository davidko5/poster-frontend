import styles from "./Posts.module.scss"

export const PlusMinusInput = ({
  score,
  onPlusMinusClickHandler,
}: // onMinusClickHandler,
{
  score: number
  onPlusMinusClickHandler: (valueToIncrement: number) => void
  // onMinusClickHandler: () => void
}) => {
  return (
    <div className={styles.plusMinusInputContainer}>
      <div
        onClick={() => onPlusMinusClickHandler(1)}
        className={styles.iconContainer}
      >
        <div className={styles.iconPlus}></div>
      </div>
      <div className={styles.plusMinusInputScore}>{score}</div>
      <div
        onClick={() => onPlusMinusClickHandler(-1)}
        className={styles.iconContainer}
      >
        <div className={styles.iconMinus}></div>
      </div>
    </div>
  )
}
