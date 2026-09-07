import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const Nav = () => {
    const {selectedConversaton} = useSelector(state=>state.conversation)
    const {messages} = useSelector(state=>state.message)
    console.log(messages)
    return (
<>    {selectedConversaton && ( <div className='h-14 flex items-center justify-between px-5 
    gap-2.5 border-b border-white/6 bg-[#0d0f14]'>
        <div className='flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20'>
            <MessageSquare size={13} className='text-indigo-400'/>
        </div>
        <div className='text-[14px] font-semibold text-slate-100 tracking-tight'>
            {selectedConversaton?.title || "New Chat"}
        </div>
        <div className='text-[10px] font-medium text-slate-600 border bg-white/4 
        border-white/6 px-2 py-0.5 rounded-full'>
            {messages?.length } Messages
        </div>
    </div>)}

  </>  
  )
}

export default Nav