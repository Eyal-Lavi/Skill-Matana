import { createSlice } from "@reduxjs/toolkit";
import { searchUsers } from "./SearchThunks";

const initialState = {
  users:[],
  error:null,
  loading:false,
  hasSearched: false,
  hasFullFilled: false
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch(state) {
      state.users = [];
      state.error = null;
      state.loading = false;
      state.hasSearched = false;
      state.hasFullFilled = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasFullFilled = false;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.hasSearched = true;
        state.hasFullFilled = true;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Search failed';
        state.hasSearched = true;
        state.hasFullFilled = false;
      });
  }
});

export const searchActions = searchSlice.actions;

export default searchSlice;