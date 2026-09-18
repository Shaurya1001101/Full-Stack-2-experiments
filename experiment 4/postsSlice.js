import { createSlice, nanoid } from "@reduxjs/toolkit";
import { offsetDateKey } from "../utils/dateUtils";

// A "post" is the structured data being mapped onto the temporal layout:
// { id, title, content, date: "YYYY-MM-DD", time: "HH:MM", color }
const initialState = [
  {
    id: nanoid(),
    title: "Product teaser",
    content: "Short video teaser for the new product line.",
    date: offsetDateKey(0),
    time: "10:00",
    color: "#4f46e5",
  },
  {
    id: nanoid(),
    title: "Blog announcement",
    content: "Publish the blog post about Q3 results.",
    date: offsetDateKey(2),
    time: "14:30",
    color: "#059669",
  },
  {
    id: nanoid(),
    title: "Customer spotlight",
    content: "Share a customer success story on all channels.",
    date: offsetDateKey(5),
    time: "09:00",
    color: "#d97706",
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare({ title, content, date, time, color }) {
        return {
          payload: {
            id: nanoid(),
            title: title || "Untitled post",
            content: content || "",
            date,
            time: time || "09:00",
            color: color || "#4f46e5",
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, changes } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) {
        Object.assign(post, changes);
      }
    },
    deletePost(state, action) {
      return state.filter((p) => p.id !== action.payload);
    },
    movePost(state, action) {
      const { id, date } = action.payload;
      const post = state.find((p) => p.id === id);
      if (post) {
        post.date = date;
      }
    },
  },
});

export const { addPost, updatePost, deletePost, movePost } = postsSlice.actions;
export const selectAllPosts = (state) => state.posts;

export default postsSlice.reducer;
