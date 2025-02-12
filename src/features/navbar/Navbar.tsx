import { useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectUserById,
  currentUserSet,
  selectUserIdsOrUndefined,
} from "../users/usersSlice"
import { EntityId } from "@reduxjs/toolkit"

const frontendBaseUrl = "/poster-frontend"

export const Navbar = () => {
  const usersIds = useAppSelector(selectUserIdsOrUndefined)
  const dispatch = useAppDispatch()

  const UserSelectOption = ({ userId }: { userId: EntityId }) => {
    const user = useAppSelector((state) => selectUserById(state, userId))
    return <option value={userId}>{user?.userName}</option>
  }

  useEffect(() => {
    usersIds && dispatch(currentUserSet(usersIds[0]))
  }, [usersIds, dispatch])

  return (
    <nav className={styles.navbarContainer}>
      <section>
        <h1 className={styles.logoHeader}>Poster</h1>
        <h2 className={styles.logoHeader}>
          Made using React, Redux, Express and MongoDB
        </h2>
        <div className={styles.navBtnsAndSelectContainer}>
          <div>
            <Link to={`${frontendBaseUrl}/posts`}>Posts</Link>
          </div>
          <div>
            <Link to={`${frontendBaseUrl}/users`}>Users</Link>
          </div>
          {usersIds && (
            <select
              data-testid="userSelect"
              onChange={(e) => dispatch(currentUserSet(e.target.value))}
              className={styles.userSelector}
            >
              {usersIds.map((userId) => {
                return <UserSelectOption key={userId} userId={userId} />
              })}
            </select>
          )}
        </div>
      </section>
    </nav>
  )
}
