
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  token: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
      state.error = null
    },
    signInSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload.user
      state.token = action.payload.token
      state.isLoggedIn = true
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
      state.isLoggedIn = false
      state.token = null
    },
  },
})

export const { signInStart, signInSuccess, signInFailure, logout } = userSlice.actions;
export default userSlice.reducer
