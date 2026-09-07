import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llm.Models.js"
import { deductCredits } from "../utils/deductCredits.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pptAgent = async (data)=>{
    try {
        await checkAgentLimit(state.userId,"ppt")
        const llm=await getModel("ppt")
        const prompt = `
        You are a professional presentation designer.

        Format:
        { 
         "title":"",
        "subtitle":"",
        "slides":[
        {
        "title":"",
        "points":[
        "",
        "",
        ""]
        }
        ]
        }
        
        Rules:
        - Generate exactly 6 content slides.
        - Each slide should have 4-6 concise bullet points.
        - No markdown.
        - No explanation.
        - No code block.
        - Return ONLY JSON.

        Topic:
        ${state.prompt}
        `
        const res = await llm.invoke(prompt)
        const data = JSON.parse(res.content);
          await deductCredits(state.userId,"ppt")
        const ppt = generatePpt(data);
        const buffer = await ppt.write({
             outputType: "nodebuffer",
  });
       const filename=`ppt-${Date.now().pptx}`
        await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation");
      const downloadUrl=await getFromS3(filename,24*60);
      return {
    ...state,
    aiResponse:
    `# PPT Generated
    
    ** ${data?.title} **
    
   [Download PPT](${downloadUrl})
   
   _Link expires in 24 Hours._`
   }
    } catch(error){
         if(error?.status ==429){
            return  {
                ...state,
                aiResponse:error.data.message
            }
        }
        return {
            ...state,
            aiResponse:`Failed to generate PPT`
        }

    }
    
}