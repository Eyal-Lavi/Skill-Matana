import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  skills:{
    data:[],
    total:0,
    hasMore:null
  },
};

const metaDataSlice = createSlice({
  name: "metaData",
  initialState,
  reducers: {
    set(state, action) {
        state.skills = action.payload.skills;
    },
  },
});

export const metaDataActions = metaDataSlice.actions;

export default metaDataSlice;