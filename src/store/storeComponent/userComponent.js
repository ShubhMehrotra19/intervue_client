import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
  name: null,
  socketId: null,
  isKicked: false,
};

const userComponent = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setKicked: (state, action) => {
      state.isKicked = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const { setRole, setName, setSocketId, setKicked, resetUser } =
  userComponent.actions;
export default userComponent.reducer;
