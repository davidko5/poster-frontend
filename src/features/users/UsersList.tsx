import { useState, useMemo, useEffect, useCallback } from "react"
import { format, parseISO } from "date-fns"
import styles from "./Users.module.scss"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { fetchUsers, selectAllUsers } from "./usersSlice"
import { selectAllPosts } from "../posts/postsSlice"
import { UserAvatar } from "../components/UserAvatar"
import { loginUrl, frontendBaseUrl } from "../../misc-constant"
import { MtasUser } from "../../types/mtas-user.type"

type SortKey = "posts" | "newest" | "oldest" | "name"

const SORT_LABELS: Record<SortKey, string> = {
  posts: "Most posts",
  newest: "Newest joined",
  oldest: "Oldest joined",
  name: "A → Z",
}

const getInitials = (name: string) => {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const formatJoined = (iso: string) => {
  try {
    return `Joined ${format(parseISO(iso), "MMM yyyy")}`
  } catch {
    return ""
  }
}

const UserCard = ({
  user,
  postCount,
  isCurrent = false,
}: {
  user: MtasUser
  postCount: number
  isCurrent?: boolean
}) => {
  const joinedLabel = useMemo(
    () => formatJoined(user.createdAt),
    [user.createdAt],
  )

  return (
    <div
      className={`${styles.userCard} ${
        isCurrent ? styles.userCardCurrent : ""
      }`}
    >
      <div className={styles.avatarWrap}>
        <UserAvatar userId={user.id} size={56} />
        <span className={styles.avatarInitials}>{getInitials(user.name)}</span>
      </div>
      <div className={styles.userMeta}>
        <div className={styles.userNameRow}>
          <span className={styles.userName} title={user.name}>
            {user.name}
          </span>
          {isCurrent && <span className={styles.youTag}>you</span>}
        </div>
        <span className={styles.userEmail} title={user.email}>
          {user.email}
        </span>
        <div className={styles.statsRow}>
          <span className={styles.statChip}>
            {postCount} {postCount === 1 ? "post" : "posts"}
          </span>
          {joinedLabel && (
            <span className={styles.statMuted}>{joinedLabel}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const SkeletonCard = () => (
  <div className={`${styles.userCard} ${styles.skeleton}`}>
    <div className={`${styles.skeletonBlock} ${styles.skeletonAvatar}`} />
    <div className={styles.userMeta}>
      <div
        className={`${styles.skeletonBlock} ${styles.skeletonLine}`}
        style={{ width: "60%" }}
      />
      <div
        className={`${styles.skeletonBlock} ${styles.skeletonLine}`}
        style={{ width: "80%" }}
      />
      <div
        className={`${styles.skeletonBlock} ${styles.skeletonLine}`}
        style={{ width: "40%" }}
      />
    </div>
  </div>
)

export const UsersList = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAllUsers)
  const currentUser = useAppSelector((s) => s.users.currentUser)
  const authStatus = useAppSelector((s) => s.users.status)
  const posts = useAppSelector(selectAllPosts)

  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("posts")
  const [stalled, setStalled] = useState(false)

  const postCountByAuthor = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of posts) {
      map[p.authorId] = (map[p.authorId] ?? 0) + 1
    }
    return map
  }, [posts])

  const authResolved = authStatus === "succeeded" || authStatus === "failed"
  const noUsersYet = users.length === 0

  // If signed-in but users list never loads, surface a retry option after a grace period
  useEffect(() => {
    if (currentUser && noUsersYet) {
      const t = setTimeout(() => setStalled(true), 10000)
      return () => clearTimeout(t)
    }
    setStalled(false)
  }, [currentUser, noUsersYet])

  const retry = useCallback(() => {
    setStalled(false)
    dispatch(fetchUsers())
  }, [dispatch])

  const others = useMemo(
    () => (currentUser ? users.filter((u) => u.id !== currentUser.id) : users),
    [users, currentUser],
  )

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    const source = query ? users : others
    const filtered = q
      ? source.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      : source
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "posts":
          return (postCountByAuthor[b.id] ?? 0) - (postCountByAuthor[a.id] ?? 0)
        case "newest":
          return b.createdAt.localeCompare(a.createdAt)
        case "oldest":
          return a.createdAt.localeCompare(b.createdAt)
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
    return sorted
  }, [users, others, query, sortKey, postCountByAuthor])

  // Signed-out — only after auth resolved so we don't flash this during initial load
  if (!currentUser && authResolved) {
    return (
      <div className={styles.usersPage}>
        <div className={styles.signedOutCard}>
          <div className={styles.signedOutIcon} aria-hidden>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className={styles.signedOutTitle}>Sign in to see members</h2>
          <p className={styles.signedOutBody}>
            Only signed-in users can browse the community directory.
          </p>
          <a className={styles.signedOutCta} href={loginUrl}>
            Sign in
          </a>
        </div>
      </div>
    )
  }

  // Signed-in but users fetch didn't deliver in time — offer retry
  if (currentUser && noUsersYet && stalled) {
    return (
      <div className={styles.usersPage}>
        <div className={styles.signedOutCard}>
          <div className={styles.errorIcon} aria-hidden>
            <img
              src={`${frontendBaseUrl}/images/octagon-alert.svg`}
              width={40}
              height={40}
              alt=""
            />
          </div>
          <h2 className={styles.signedOutTitle}>Couldn't load members</h2>
          <p className={styles.signedOutBody}>
            Something went wrong fetching the directory.
          </p>
          <button type="button" className={styles.signedOutCta} onClick={retry}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Initial loading (no users yet)
  if (noUsersYet) {
    return (
      <div className={styles.usersPage}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Members</h2>
            <span className={styles.pageCount}>Loading…</span>
          </div>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const currentUserEntity = currentUser
    ? users.find((u) => u.id === currentUser.id)
    : undefined

  return (
    <div className={styles.usersPage}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Members</h2>
          <span className={styles.pageCount}>{users.length} total</span>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Sort members"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentUserEntity && !query && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>You</h3>
          <div className={styles.grid}>
            <UserCard
              user={currentUserEntity}
              postCount={postCountByAuthor[currentUserEntity.id] ?? 0}
              isCurrent
            />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {query ? "Results" : "Everyone"} ({filteredSorted.length})
        </h3>
        {filteredSorted.length === 0 ? (
          <div className={styles.emptyResult}>
            No members match &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredSorted.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                postCount={postCountByAuthor[u.id] ?? 0}
                isCurrent={currentUser?.id === u.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
