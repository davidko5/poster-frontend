import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

const isDev = import.meta.env.DEV
const backendUrl = isDev
  ? "http://localhost:3001"
  : "https://davidko5-express.onrender.com"

// when local server is not running
// const backendUrl = "https://davidko5-express.onrender.com"

const postsAdapter = createEntityAdapter({
  selectId: (instance: any) => instance._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
})
const initialState = postsAdapter.getInitialState({ status: "idle" })

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        postsAdapter.upsertMany(state, action.payload.data)
        state.status = "succeded"
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload.id)
      })
  },
})

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await fetch(`${backendUrl}/posts/list`)
  return response.json()
})

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (
    {
      content,
      author,
    }: {
      content: string
      author: string
    },
    { dispatch },
  ) => {
    const response = await fetch(`${backendUrl}/posts/add`, {
      method: "POST",
      body: JSON.stringify({
        content: content,
        author: author,
        score: 0,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    dispatch(fetchPosts())
    return response.json()
  },
)

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (
    {
      content,
      postId,
      author,
    }: {
      content: string
      postId: string
      author: string
    },
    { dispatch },
  ) => {
    const response = await fetch(`${backendUrl}/posts/add/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        content: content,
        author: author,
        score: 0,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    dispatch(fetchPosts())
    return response.json()
  },
)

export const addReply = createAsyncThunk(
  "posts/addReply",
  async (
    {
      content,
      postId,
      commentId,
      author,
      repliedTo,
    }: {
      content: string
      postId: string
      commentId: string
      author: string
      repliedTo: string
    },
    { dispatch },
  ) => {
    const response = await fetch(
      `${backendUrl}/posts/add/${postId}/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          content: content,
          author: author,
          repliedTo: repliedTo,
          score: 0,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
    dispatch(fetchPosts())
    return response.json()
  },
)

export const editPost = createAsyncThunk(
  "posts/editPost",
  async (
    {
      content,
      score,
      postId,
    }: {
      content?: string
      score?: string
      postId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(`${backendUrl}/posts/edit/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        ...(content && { content }),
        ...(score && { score }),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    dispatch(fetchPosts())
    return response.json()
  },
)

export const editComment = createAsyncThunk(
  "posts/editComment",
  async (
    {
      content,
      score,
      postId,
      commentId,
    }: {
      content?: string
      score?: string
      postId: string
      commentId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(
      `${backendUrl}/posts/edit/${postId}/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...(content && { content }),
          ...(score && { score }),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
    dispatch(fetchPosts())
    return response.json()
  },
)

export const editReply = createAsyncThunk(
  "posts/editReply",
  async (
    {
      content,
      score,
      postId,
      commentId,
      replyId,
    }: {
      content?: string
      score?: string
      postId: string
      commentId: string
      replyId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(
      `${backendUrl}/posts/edit/${postId}/${commentId}/${replyId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...(content && { content }),
          ...(score && { score }),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
    dispatch(fetchPosts())
    return response.json()
  },
)

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (
    {
      postId,
    }: {
      postId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(`${backendUrl}/posts/delete/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    dispatch(fetchPosts())
    return response.json()
  },
)

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (
    {
      postId,
      commentId,
    }: {
      postId: string
      commentId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(
      `${backendUrl}/posts/delete/${postId}/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
    dispatch(fetchPosts())
    return response.json()
  },
)

export const deleteReply = createAsyncThunk(
  "posts/deleteReply",
  async (
    {
      postId,
      commentId,
      replyId,
    }: {
      postId: string
      commentId: string
      replyId: string
    },
    { dispatch },
  ) => {
    const response = await fetch(
      `${backendUrl}/posts/delete/${postId}/${commentId}/${replyId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
    dispatch(fetchPosts())
    return response.json()
  },
)

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostsIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export default postsSlice.reducer
