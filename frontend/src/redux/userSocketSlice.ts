import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
}

const initialState: SocketState = {
  isConnected: false,
};

const userSocketSlice = createSlice({
  name: "userSocket",
  initialState,
  reducers: {
    setSocket(state) {
      state.isConnected = true;
    },
    disconnectSocket(state) {
      state.isConnected = false;
    },
  },
});

export const { setSocket, disconnectSocket } = userSocketSlice.actions;

export default userSocketSlice.reducer;
