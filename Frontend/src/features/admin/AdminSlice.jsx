import { createSlice } from "@reduxjs/toolkit";
import { fetchPendingSkillRequests, updateSkillRequestStatus, updateSkillStatus } from "./adminThunks";
const initialState = {
    pendingSkillRequests:[],
    loading:false,
    error:null,
    hasFetched:false
}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        
    },
    extraReducers:(builder) => {
        builder
        .addCase(fetchPendingSkillRequests.pending , (state) => {
            state.loading = true;
        state.error = null;
        state.hasFetched = false;
      })
      .addCase(fetchPendingSkillRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingSkillRequests = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchPendingSkillRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch skill requests';
        state.hasFetched = false;
      })
      
      .addCase(updateSkillRequestStatus.fulfilled , (state , action) => {
        const requestId = action.payload.requestId;
        state.pendingSkillRequests = state.pendingSkillRequests.filter(req => req.id !== requestId);
      })
      .addCase(updateSkillRequestStatus.rejected , (state , action) => {
        state.error = action.payload;
      })
      .addCase(updateSkillStatus.fulfilled , (state , action) => {
        // Skill status updated successfully
        state.error = null;
      })
      .addCase(updateSkillStatus.rejected , (state , action) => {
        state.error = action.payload;
      })
      ;
    }
});

export const adminActions = adminSlice.actions;

export default adminSlice;