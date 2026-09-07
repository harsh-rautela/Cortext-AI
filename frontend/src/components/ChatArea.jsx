import React from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setArtifacts, setMessages } from '../redux/messageSlice'
const ChatArea = () => {
        const {selectedConversaton} = useSelector(state=>state.conversation)
        const dispatch = useDispatch()
    useEffect(()=>{
        const getMesg = async ()=>{
            if(selectedConversaton){
                if(selectedConversaton?.title =="New Chat") return;
                  const data= await getMessages(selectedConversaton?._id)
                  console.log("messages",data)
                  dispatch(setMessages(data))
                  const latestArtifactMessage = [...data].reverse().find(msg=>msg.artifacts && msg.artifacts.length>0)
                  dispatch(setArtifacts(latestArtifactMessage?.artifacts || []))
            }
        }
        getMesg();
    },[selectedConversaton?._id])
  return (
    <div className='flex-1 flex flex-col min-w-0'>
        <Nav/>
        <MessageList/>
        <ChatInput/>
    </div>
  )
}

export default ChatArea