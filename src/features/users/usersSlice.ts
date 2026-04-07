import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { MtasUser } from "../../types/mtas-user.type"

const isDev = import.meta.env.DEV
const backendUrl = isDev
  ? "http://localhost:5012"
  : "https://davidko5-express.onrender.com"

const usersAdapter = createEntityAdapter<MtasUser>({
  selectId: (instance: any) => instance.id,
})

const initialState = usersAdapter.getInitialState<{
  status: "idle" | "loading" | "succeeded" | "failed"
  currentUser: MtasUser | null
}>({
  status: "idle",
  currentUser: null,
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload)
        state.status = "succeeded"
      })
      .addCase(getAuthenticatedUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getAuthenticatedUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentUser = action.payload
      })
      .addCase(getAuthenticatedUser.rejected, (state) => {
        state.status = "failed"
        state.currentUser = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded"
        state.currentUser = null
      })
  },
})

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${backendUrl}/auth/users`, {
      credentials: "include",
    })

    if (!response.ok) {
      // try to parse JSON error, or fallback
      let message = `HTTP ${response.status}`
      try {
        const err = await response.json()
        message = err.message || message
      } catch {}
      return rejectWithValue(message)
    }

    return response.json()
  },
)

export const getAuthenticatedUser = createAsyncThunk<
  MtasUser,
  void,
  {
    rejectValue: string
  }
>("users/getAuthenticatedUser", async (_, { rejectWithValue }) => {
  const response = await fetch(`${backendUrl}/auth/me`, {
    credentials: "include",
  })
  if (!response.ok) {
    // try to parse JSON error, or fallback
    let message = `HTTP ${response.status}`
    try {
      const err = await response.json()
      message = err.message || message
    } catch {}
    return rejectWithValue(message)
  }

  return await response.json()
})

export const logout = createAsyncThunk("users/logout", async () => {
  await fetch(`${backendUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
})

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds,
} = usersAdapter.getSelectors((state: RootState) => state.users)

export const selectUserIdsOrUndefined = createSelector(
  (state: RootState) => state.users.ids.length > 0, // Check if any users exist
  selectUsersIds,
  (hasData, ids) => (hasData ? ids : undefined),
)

export const selectCurrentUser = (state: RootState) => state.users.currentUser

// export const { currentUserSet } = usersSlice.actions
export default usersSlice.reducer
