import { createSlice } from "@reduxjs/toolkit";
import { fetchPendingSkillRequests, updateSkillRequestStatus, updateSkillStatus, fetchUsers, updateUserStatus } from "./adminThunks";
const initialState = {
    pendingSkillRequests:[],
    loading:false,
    error:null,
    hasFetched:false,
    users: [],
    usersLoading: false,
    usersError: null,
    usersPagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    },
    usersFilters: {
        search: '',
        status: null
    }
}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setUsersSearch: (state, action) => {
            state.usersFilters.search = action.payload;
        },
        setUsersStatusFilter: (state, action) => {
            state.usersFilters.status = action.payload;
        },
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
   
        state.error = null;
      })
      .addCase(updateSkillStatus.rejected , (state , action) => {
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.users = state.users.map(user => 
          user.id === userId ? { ...user, status } : user
        );
        state.usersError = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.usersError = action.payload;
      })
      ;
    }
});

export const adminActions = adminSlice.actions;

export default adminSlice;