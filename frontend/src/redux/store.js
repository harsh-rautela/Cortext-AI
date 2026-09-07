import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './userSlice.js'
import conversationReducer from './conversation.slice.js'
import messageReducer from "./messageSlice.js"
export const store = configureStore({
    reducer:{
        user:userReducer,
        conversation:conversationReducer,
        message:messageReducer
    },
})