export const selectPendingSkillRequests = (state) => state.admin.pendingSkillRequests;

export const selectAdminLoading = (state) => state.admin.loading;

export const selectAdminError = (state) => state.admin.error;

export const selectAdminHasFetched = (state) => state.admin.hasFetched;

export const selectUsers = (state) => state.admin.users;

export const selectUsersLoading = (state) => state.admin.usersLoading;

export const selectUsersError = (state) => state.admin.usersError;

export const selectUsersPagination = (state) => state.admin.usersPagination;

export const selectUsersFilters = (state) => state.admin.usersFilters;