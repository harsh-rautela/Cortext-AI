import { Zap,Mic, Paperclip,Presentation, Send,MessageSquare ,Code2,FileText, Globe, ImageIcon, FileTextIcon, X} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import sendMessage from '../features/sendMessage';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages ,addMessage, setArtifacts, setIsLoading} from '../redux/messageSlice';
import { createConversation } from '../features/createConversation';
import { addConversation, selectConversation, setConvTitle } from '../redux/conversation.slice';
import { upDateConversation } from '../features/updateConversation';
import { useRef } from 'react';

const ChatInput = () => {
  const fileRef = useRef(null)
  const {selectedConversaton}= useSelector(state=>state.conversation)
  const [value,setValue]=useState("");
  const [selectedAgent,setSelectedAgent]=useState("Auto");
  const [selectedFile,setSelectedFile]= useState(null)
  const {messages,isLoading} = useSelector(state=>state.message)
  const dispatch = useDispatch();
  const [listening,setListening] =useState(false);
  // const recognitionRef = useRef(null);
const recognitionRef = useRef(null);
const finalTranscriptRef = useRef("");

useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (
      let index = event.resultIndex;
      index < event.results.length;
      index++
    ) {
      const result = event.results[index];

      if (result.isFinal) {
        finalTranscriptRef.current += result[0].transcript + " ";
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    setValue(
      finalTranscriptRef.current + interimTranscript
    );
  };

  recognition.onend = () => {
    setListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setListening(false);
  };

  recognitionRef.current = recognition;

  return () => {
    recognition.stop();
  };
}, []);




//   useEffect(()=>{
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if(!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.continuous = true;
    
//     recognition.onresult = (event) => {
//   let transcript ="";
//   for(let index=event.resultIndex;index<event.results.length;index++){
//     transcript += event.results[index][0].transcript
//   } 
//   setValue(transcript);
// };

// recognition.onend = (event) => {
//   setListening(false);
// };
// recognitionRef.current = recognition;
//   },[])
  
const toggleMic = () => {
  if (!recognitionRef.current) {
    alert("Speech recognition not supported");
    return;
  }

  if (listening) {
    recognitionRef.current.stop();
    setListening(false);
  } else {
    finalTranscriptRef.current = value
      ? value.trim() + " "
      : "";

    recognitionRef.current.start();
    setListening(true);
  }
};

  const handleSendMessage = async ()=>{
    dispatch(setIsLoading(true))
    let conversation =selectedConversaton;
    if(!conversation){
     const conv= await createConversation()
     dispatch(selectConversation(conv))
     dispatch(addConversation(conv))
     conversation=conv
    }
    
    if(conversation.title == "New Chat"){
      const {data}= await upDateConversation({id:conversation?._id,title:value.trim()})
      dispatch(setConvTitle({conversationId:conversation?._id,title:value.slice(0,40)}))
    }
    

   const formData = new FormData()
   formData.append("prompt",value.trim())
   formData.append("conversationId",conversation?._id)
   formData.append("agent",selectedAgent.toLowerCase())
   formData.append("file",selectedFile)
   
   


    dispatch(addMessage({role:"user",content:value.trim()}))
        setValue("")
    const data = await sendMessage(formData);
    dispatch(setIsLoading(false))
    setSelectedFile(null)
    dispatch(setArtifacts(data?.artifacts || []))
    dispatch(addMessage({role:"assistant",content:data?.answer,images:data?.images}))
    console.log(data)
  }
  const agents=[{
    id:"auto",
    icon:Zap,
    label:"Auto"
  },
{
    id:"chat",
    icon:MessageSquare,
    label:"Chat"
  },
  {
    id:"coding",
    icon:Code2,
    label:"Coding"
  },
  {
    id:"pdf",
    icon:FileText,
    label:"PDF"
  },
{
    id:"vision",
    icon:ImageIcon,
    label:"vision"
  },
  {
    id:"ppt",
    icon:Presentation,
    label:"PPT"
  },
    {
    id:"search",
    icon:Globe,
    label:"Search"
  },
]
  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]'>
      <div className='flex flex-col gap-2 bg-white/3 border border-white/7 
      rounded-2xl px-4 pt-3.5 pb-3'>

        <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
          {agents.map((agent)=>{
            const isActive = selectedAgent ==agent.label;
            const Icon = agent.icon;
            return (
              <div className={`shrink-0 inline-flex items-center  
              gap-1.5 px-3 py-2 rounded-full text-xs 
              font-medium border transition-all  
              ${isActive?"bg-linear-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]":"bg-white/3 text-slate-400 border-white/6 hover:bg-white/7"} `} onClick={()=>setSelectedAgent(agent.label)}>
                <Icon size={14} className={isActive?"text-white":"text-slate-500"}  />
                {agent.label}
              </div>
            )

          })}

        </div>

          {selectedFile && (
            <div className='my-3'>
              <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2'>
              {
                selectedFile.type ==="application/pdf" ?<FileTextIcon size={16} className='text-red-400'/>: selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className='h-10 w-10 rounded-xl object-cover mt-3'/>
              }

                            <div >
                <p className='text-xs text-white'>{selectedFile?.name}</p>
                <p className='text-[10px] text-slate-500'>{Math.ceil(selectedFile.size)}KB</p>
              </div>
              <button onClick={()=>{setSelectedFile(null); fileRef.current.value=null}} className='ml-2'>
                <X className='text-slate-500 hover:text-white' size={14}/>

              </button>
              </div>


            </div>
          )}
        <textarea  placeholder='Ask anything..' className='w-full bg-transparent outline-none resize-none 
        text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none
         [&::-webkit-scrollbar]:hidden disabled:opacity-50' rows={3} onChange={(e)=>setValue(e.target.value)} value={value}>

        </textarea>
        <div className='flex items-center justify-between '>
          <div className='flex items-center gap-1'>
           <input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e)=>{
            const file = e.target.files[0];
            if(file){
            setSelectedFile(file)
            }
           }}/>
           
            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 
            hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer' onClick={()=>fileRef.current.click()}>
              <Paperclip size={16}/>
            </button>
<button
  className={`flex items-center justify-center w-8 h-8 rounded-lg
    border transition-all duration-150 bg-transparent cursor-pointer
    ${
      listening
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : "text-slate-600 hover:text-slate-400 hover:bg-white/5 border-transparent hover:border-white/6"
    }
  `}
  onClick={toggleMic}
>
  <Mic size={16} />
</button>
          </div>

          <button disabled={!value || isLoading } className={`flex items-center justify-center w-8 h-8 
          rounded-lg border-none cursor-pointer transition-all duration-150  ${value.trim()?"bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-80 text-white":"bg-white/5 text-slate-600 cursor-not-allowed"} `} onClick={handleSendMessage}>
            <Send size={15}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput