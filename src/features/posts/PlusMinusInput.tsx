import styles from "./Posts.module.scss"

export const PlusMinusInput = ({
  score,
  onPlusMinusClickHandler,
}: {
  score: number
  onPlusMinusClickHandler: (valueToIncrement: number) => void
}) => {
  return (
    <div className={styles.plusMinusInputContainer}>
      <div
        data-testid="plusContainer"
        className={styles.iconContainer}
        onClick={() => onPlusMinusClickHandler(1)}
      >
        <div data-testid="plusIcon" className={styles.iconPlus} />
      </div>
      <div data-testid="scoreContainer" className={styles.plusMinusInputScore}>
        {score}
      </div>
      <div
        data-testid="minusContainer"
        className={styles.iconContainer}
        onClick={() => onPlusMinusClickHandler(-1)}
      >
        <div className={styles.iconMinus} />
      </div>
    </div>
  )
}
