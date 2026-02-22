import Avatar from "boring-avatars"

const COLORS = ["#635BFF", "#28A06E", "#E8930C", "#E04868", "#1B9AD1", "#9054C8", "#D4652A", "#4F9C3E"]

export const UserAvatar = ({
  userId,
  size = 36,
  style,
}: {
  userId: string | number
  size?: number
  style?: React.CSSProperties
}) => {
  return (
    <div style={{ flexShrink: 0, lineHeight: 0, ...style }}>
      <Avatar size={size} name={String(userId)} variant="marble" colors={COLORS} />
    </div>
  )
}
