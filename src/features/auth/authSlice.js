import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, logoutUser } from "./authService";

// thunks
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => await getCurrentUser()
);

export const login = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => await loginUser({ email, password })
);

export const logout = createAsyncThunk(
  "auth/logoutUser",
  async () => await logoutUser()
);

/**
 *
 * Slice
 *
 */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    sessionId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch users
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error;
      })

      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        // state.user = action.payload.user;
        state.sessionId = action.payload.$id;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = action.error;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.sessionId = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        console.log(action.error);
      });
  },
});

export default authSlice.reducer;
