import {getModel} from "../config/llm.Models.js"
export const router = async (state)=>{
     console.log("here")
     if(state?.agent && state.agent !== "auto"){
          return {...state,agent:state.agent}
     }
     if(state?.file && state?.file.mimetype =="application/pdf" ){
        return {
          ...state,
          agent:"pdfRag"
        }
    }
    if(state?.file && state?.file.mimetype.startsWith("image/")){
       return {
          ...state,
          agent:"imageAnalyzer"
        }
    }
    console.log("here")
     const llm = await getModel("router")
     const prompt = `You are an agent router.
     Available agents:
      -chat 
      -search
      -coding
      -pdf
      -ppt
      -vision
     
      Rules:
      chat:General conversation,explanations,learning,questions.
      search:Current events,latest information,news, recent developments, internet lookup.
      coding:Generate code,debug code,build projects,architecture, API design.
      pdf: Questions about generate PDFs, or document context
      ppt:Questions about generate PDFs or document context.
      vision: Generate images ,create image query
      
      Return ONLY one word:
      chat
      search
      coding
      pdf
      ppt
      vision
     
      User Query:${state.prompt} `
     const response = await llm.invoke(prompt)
     console.log(response)
     return {...state,agent:response.content.trim().toLowerCase()}


}