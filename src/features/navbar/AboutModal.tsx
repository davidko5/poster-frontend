import { useRef } from "react"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"
import styles from "./AboutModal.module.scss"

const techStack = [
  "React 18",
  "Redux Toolkit",
  "TypeScript",
  "Vite",
  "Express",
  "MongoDB",
  "SCSS Modules",
]

export const AboutModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  useOutsideAlerter(modalRef, onClose)

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className={styles.title}>Poster</h2>
        <p className={styles.description}>
          A full-stack discussion platform built as a personal project to
          practice modern web development. Users can create posts, comment,
          reply, and vote — powered by a custom-built auth platform and a clean
          Redux-driven state layer.
        </p>

        <div className={styles.techSection}>
          <p className={styles.sectionLabel}>Built with</p>
          <div className={styles.badges}>
            {techStack.map((tech) => (
              <span key={tech} className={styles.badge}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.mtasSection}>
          <p className={styles.sectionLabel}>Authentication</p>
          <p className={styles.mtasDescription}>
            Auth is handled by{" "}
            <strong>MTAS</strong> (Multi-Tenant Auth Service) — a custom-built
            auth broker that issues RS256 JWT tokens and supports multiple
            independent apps from a single auth layer.
          </p>
          <div className={styles.mtasTechRow}>
            {["NestJS", "Next.js", "PostgreSQL", "JWT RS256"].map((t) => (
              <span key={t} className={styles.badgeSecondary}>
                {t}
              </span>
            ))}
          </div>
          <a
            href="https://github.com/davidko5/multi-tenant-auth-service"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View MTAS on GitHub ↗
          </a>
        </div>

        <a
          href="https://github.com/davidko5/poster-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View Poster on GitHub ↗
        </a>
      </div>
    </div>
  )
}
