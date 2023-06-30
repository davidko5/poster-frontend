import { useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectUsersIds,
  selectUserById,
  currentUserSet,
} from "../users/usersSlice"
import { EntityId } from "@reduxjs/toolkit"

export const Navbar = () => {
  const usersIds = useAppSelector(selectUsersIds)
  const dispatch = useAppDispatch()

  const UserSelectOption = ({ userId }: { userId: EntityId }) => {
    const user = useAppSelector((state) => selectUserById(state, userId))
    return <option value={userId}>{user.userName}</option>
  }

  useEffect(() => {
    dispatch(currentUserSet(usersIds[0]))
  })

  return (
    <nav className={styles.navbarContainer}>
      <section>
        <h1 className={styles.logoHeader}>Poster</h1>
        <h2 className={styles.logoHeader}>
          Made using React, Redux, Express, MongoDB
        </h2>
        <div className={styles.navBtnsAndSelectContainer}>
          <div>
            <Link to={"/posts"}>Posts</Link>
          </div>
          <div>
            <Link to={"/users"}>Users</Link>
          </div>
          <select
            onChange={(e) => dispatch(currentUserSet(e.target.value))}
            className={styles.userSelector}
          >
            {usersIds.map((userId) => {
              return <UserSelectOption key={userId} userId={userId} />
            })}
          </select>
        </div>
      </section>
    </nav>
  )
}
