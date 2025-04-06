import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserProps = {
  userId: string | null;
  email: string | null;
  token: string | null;
};

const initialState: UserProps = {
  userId: null,
  email: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProps>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
