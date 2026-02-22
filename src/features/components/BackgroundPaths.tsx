import { motion } from "framer-motion"
import React from "react"

// Original paths follow a precise pattern: each shifts by (22, -24) from the previous.
// Half-step (11, -12) for double density without breaking the smooth S-curve shape.
const generatePaths = () => {
  const paths: string[] = []
  for (let i = 0; i < 40; i++) {
    const dx = i * 11
    const dy = i * -12
    paths.push(
      `M${-380 + dx} ${-189 + dy}C${-380 + dx} ${-189 + dy} ${-312 + dx} ${216 + dy} ${152 + dx} ${343 + dy}C${616 + dx} ${470 + dy} ${684 + dx} ${875 + dy} ${684 + dx} ${875 + dy}`
    )
  }
  return paths
}

const pathData = generatePaths()

const animations = pathData.map((_, i) => ({
  duration: 8 + (i % 7) * 1.2,
  delay: i * 0.12,
}))

export const BackgroundPaths = React.memo(() => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        style={{ position: "absolute", width: "100%", height: "100%" }}
        fill="none"
        viewBox="0 0 696 316"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Static faint paths */}
        <g opacity="0.04">
          {pathData.map((d, i) => (
            <path key={`static-${i}`} d={d} stroke="hsl(220, 8%, 65%)" strokeWidth="0.3" />
          ))}
        </g>

        {/* Animated beams — gentle pulse, never fully disappear */}
        {pathData.map((d, i) => (
          <motion.path
            key={`beam-${i}`}
            d={d}
            stroke={`url(#gradient-${i})`}
            strokeWidth="0.4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.08 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0.08, 0.25, 0.2, 0.08],
            }}
            transition={{
              duration: animations[i].duration,
              delay: animations[i].delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <defs>
          {pathData.map((_, i) => (
            <linearGradient
              key={`gradient-${i}`}
              id={`gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(220, 8%, 72%)" stopOpacity="0" />
              <stop offset="20%" stopColor="hsl(220, 8%, 72%)" stopOpacity="1" />
              <stop offset="50%" stopColor="hsl(225, 10%, 70%)" stopOpacity="1" />
              <stop offset="80%" stopColor="hsl(220, 8%, 72%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(220, 8%, 72%)" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
})

BackgroundPaths.displayName = "BackgroundPaths"
