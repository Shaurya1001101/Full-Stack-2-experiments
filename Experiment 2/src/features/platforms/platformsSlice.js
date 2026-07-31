import { createSlice } from "@reduxjs/toolkit";
import { PLATFORMS } from "../../data/platforms";

// Only the *connection* status is real app state - the rest of each
// platform's data (limits, colors...) is static reference data.
const initialState = {
  connected: PLATFORMS.reduce((acc, p) => {
    acc[p.id] = true;
    return acc;
  }, {}),
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    toggleConnection: (state, action) => {
      const id = action.payload;
      state.connected[id] = !state.connected[id];
    },
  },
});

export const { toggleConnection } = platformsSlice.actions;

export const selectConnectedMap = (state) => state.platforms.connected;
export const selectIsConnected = (state, id) => state.platforms.connected[id];

export default platformsSlice.reducer;
