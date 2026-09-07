import React from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import { useRef } from 'react'
import { useEffect } from 'react'




const MessageList = () => {
  const {selectedConversaton} = useSelector(state=>state.conversation)
  const {messages,isLoading} = useSelector(state=>state.message)
  const bottomRef = useRef(null);
  useEffect(()=>{
    requestAnimationFrame(()=>{
      bottomRef?.current.scrollIntoView({
        behaviour:"smooth",
        block:"end"
      })
    })

  },[messages?.length,isLoading])

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-none [&::-webkit-scrollbar]:hidden'>
      {(messages?.length===0 || !selectedConversaton)?
      (<div className='h-full flex flex-col items-center justify-center gap-4 text-center'>
         <div className='flex flex-col gap-1.5'>
          <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight '> Cortex Ai</h1>
          <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can i help you?</p>
          <p className='text-[13px]  text-slate-600 max-w-65 leading-relaxed' >Ask me anything -code , ideas ,explanations or just a quick question.</p>

         </div>
         <div className='flex flex-wrap justify-center gap-2 mt-1'>
          {["Write a Netfilx clone","Explain Redis","Build a dashboard"].map((s)=>(
            <button className='text-[12px] text-slate-400 cursor-pointer bg-white/4 border border-white/7 px-3 py-1.5 rounded-lg hover:bg-white/8 hover:text-slate-200 transition-colors duration-150'>
              {s}
            </button>

          ))}
         </div>

      </div>):(
        <div className='space-y-5'>

          {messages.map((msg,i)=>(
            <div key={i}>
              <MessageBubble role={msg?.role} content={msg?.content}  images={msg.images || []}/>
            </div>
          ))}
          {isLoading &&           <LoadingAnimation/> }



        </div>
      )}
      <div ref={bottomRef}/>
    </div>
  )
}

export default MessageList