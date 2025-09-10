export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUser = (state) => state.auth.user;

export const selectUserId = (state) => state.auth.user.id;
export const selectUsername = (state) => state.auth.user.username;
export const selectFirstName = (state) => state.auth.user.firstName;
export const selectLastName = (state) => state.auth.user.lastName;
export const selectEmail = (state) => state.auth.user.email;
export const selectPermissions = (state) => state.auth.user.permissions;
export const selectSkills = (state) => state.auth.user.skills;
export const selectConnections = (state) => state.auth.user.connections || [];
export const selectGender = (state) => state.auth.user.gender;
export const selectProfilePicture = (state) => state.auth.user.profilePicture;

export const selectIsAdmin = (state) => 
  state.auth.user?.permissions?.some(permission => permission.id === 99);
