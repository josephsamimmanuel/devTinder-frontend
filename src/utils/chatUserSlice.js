import { createSlice } from "@reduxjs/toolkit";

// Get initial state from sessionStorage if available
const getInitialState = () => {
  const savedChatUser = sessionStorage.getItem('chatUser');
  return {
    chatUser: savedChatUser ? JSON.parse(savedChatUser) : null,
  };
};

const chatUserSlice = createSlice({
    name: "chatUser",
    initialState: getInitialState(),
    reducers: {
        setChatUser: (state, action) => {
            state.chatUser = action.payload;
            // Save to sessionStorage whenever chatUser is updated
            sessionStorage.setItem('chatUser', JSON.stringify(action.payload));
        },
    },
});

export const { setChatUser } = chatUserSlice.actions;
export default chatUserSlice.reducer;
