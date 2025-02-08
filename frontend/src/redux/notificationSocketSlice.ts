import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
}

const initialState: SocketState = {
  isConnected: false,
};

const notificationSocketSlice = createSlice({
  name: "notificationSocket",
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

export const { setSocket, disconnectSocket } = notificationSocketSlice.actions;

export default notificationSocketSlice.reducer;
