import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import composerReducer from "../features/composer/composerSlice";
import platformsReducer from "../features/platforms/platformsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    composer: composerReducer,
    platforms: platformsReducer,
  },
});
