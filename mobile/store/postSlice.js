import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
  },

  reducers: {
    fetchPostsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchPostsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },

    updatePostLikes: (state, action) => {
      const { postId, userId } = action.payload;
      const postToUpdate = state.posts.find((post) => post._id === postId);

      if (postToUpdate) {
        if (postToUpdate.likes.includes(userId)) {
          postToUpdate.likes = postToUpdate.likes.filter((id) => id !== userId);
        } else {
          postToUpdate.likes.push(userId);
        }
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  deletePost,
  updatePostLikes,
} = postSlice.actions;
export default postSlice.reducer;
