import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  selectedPlatformIds: [],
  media: [], // { id, url }
};

const composerSlice = createSlice({
  name: "composer",
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    togglePlatform: (state, action) => {
      const id = action.payload;
      if (state.selectedPlatformIds.includes(id)) {
        state.selectedPlatformIds = state.selectedPlatformIds.filter(
          (p) => p !== id
        );
      } else {
        state.selectedPlatformIds.push(id);
      }
    },
    addMedia: {
      reducer: (state, action) => {
        state.media.push(action.payload);
      },
      prepare: (url) => ({ payload: { id: nanoid(), url } }),
    },
    removeMedia: (state, action) => {
      state.media = state.media.filter((m) => m.id !== action.payload);
    },
    resetDraft: () => initialState,
  },
});

export const {
  setText,
  togglePlatform,
  addMedia,
  removeMedia,
  resetDraft,
} = composerSlice.actions;

export const selectDraft = (state) => state.composer;

export default composerSlice.reducer;
