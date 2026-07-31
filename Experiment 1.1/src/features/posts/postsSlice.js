import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { validateForPlatforms } from "../../utils/validation";

// Normalized shape: { byId: { [id]: post }, allIds: [id, ...] }
// A single "publish" produces one post record per selected platform,
// all sharing the same groupId so the feed can present them together.
const initialState = {
  byId: {},
  allIds: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Simulated network latency + occasional platform-side failure, so the
// pending/fulfilled/rejected lifecycle has something real to show.
const mockApiCall = (platform) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error(`${platform.name} rejected the request. Try again.`));
      } else {
        resolve();
      }
    }, 500 + Math.random() * 500);
  });

export const publishPost = createAsyncThunk(
  "posts/publishPost",
  async ({ draft, platforms }, { rejectWithValue }) => {
    const { allValid, results } = validateForPlatforms(platforms, draft);
    if (!allValid) {
      return rejectWithValue({
        message: "Fix the highlighted issues before publishing.",
        results,
      });
    }

    const groupId = nanoid();
    const createdAt = new Date().toISOString();

    const posts = await Promise.all(
      platforms.map(async (platform) => {
        await mockApiCall(platform);
        return {
          id: nanoid(),
          groupId,
          platformId: platform.id,
          text: draft.text,
          media: draft.media,
          createdAt,
          status: "published",
        };
      })
    );

    return posts;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    deletePost: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((existingId) => existingId !== id);
    },
    deleteGroup: (state, action) => {
      const groupId = action.payload;
      const idsToRemove = state.allIds.filter(
        (id) => state.byId[id].groupId === groupId
      );
      idsToRemove.forEach((id) => delete state.byId[id]);
      state.allIds = state.allIds.filter((id) => !idsToRemove.includes(id));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.forEach((post) => {
          state.byId[post.id] = post;
          state.allIds.unshift(post.id);
        });
      })
      .addCase(publishPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { deletePost, deleteGroup } = postsSlice.actions;

export const selectAllPosts = (state) =>
  state.posts.allIds.map((id) => state.posts.byId[id]);
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;

export default postsSlice.reducer;
