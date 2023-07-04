import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

const isDev = import.meta.env.DEV
const backendUrl = isDev
  ? "http://localhost:3001"
  : "https://poster-backend.onrender.com"

// when local server is not running
// const backendUrl = "https://poster-backend.onrender.com"

const usersAdapter = createEntityAdapter({
  selectId: (instance: any) => instance._id,
})

const initialState = usersAdapter.getInitialState({
  status: "idle",
  currentUser: "",
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    currentUserSet(state, action) {
      state.currentUser = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      usersAdapter.upsertMany(state, action.payload.data)
      state.status = "succeded"
    })
  },
})

export const fetchUsers = createAsyncThunk("posts/fetchUsers", async () => {
  const response = await fetch(`${backendUrl}/users/list`)
  return response.json()
})

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds,
} = usersAdapter.getSelectors((state: RootState) => state.users)

export const { currentUserSet } = usersSlice.actions
export default usersSlice.reducer
