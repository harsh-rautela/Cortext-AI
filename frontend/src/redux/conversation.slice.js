import {createSlice} from "@reduxjs/toolkit"
const conversationSlice = createSlice({
    name:"conversation",
    initialState:{
        conversations:[],
        selectedConversaton:null
    },
    reducers:{
        setConversation:(state,action)=>{
            state.conversations = action.payload
        },
        addConversation:(state,action)=>{
            state.conversations.unshift(action.payload)
        },
        selectConversation:(state,action)=>{
            state.selectedConversaton=action.payload
        },
        setConvTitle:(state,action)=>{
            const {title,conversationId} = action.payload;
            state.conversations = state.conversations.map((conv)=>(
                conv._id == conversationId? ({...conv,title}):conv
            ))
            if(state.selectedConversaton?._id == conversationId){
                state.selectedConversaton = {...state.selectedConversaton,title}
            }
        }

    }
})

export const {setConversation,addConversation,selectConversation,setConvTitle}= conversationSlice.actions
export default conversationSlice.reducer