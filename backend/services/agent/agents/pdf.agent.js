import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llm.Models.js"
import { deductCredits } from "../utils/deductCredits.js";
import generatePdf from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pdfAgent = async (state)=>{
    try {
    await checkAgentLimit(state.userId,"pdf")
    const llm= await getModel("pdf")
    const prompt =`
    You are an expert document writer.

    Return ONLY valid JSON.

    Do NOT return markdown.

    Do NOT return explanations.

    Structure:

    {
    "title":"",
    "subtitle":"",
    "sections":[
    { "heading":"",
      "points":[]
    }
    ]
    }

    Generate 4-8 sections.

    Each section should have 3-6 concise bullet points.

    Topic: ${state.prompt}
    `
    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content)
      await deductCredits(state.userId,"pdf")
   const buffer= await generatePdf(data);
  const filename=`pdf-${Date.now()}.pdf`
   await uploadToS3(filename,buffer,"application/pdf");
   const downloadUrl=await getFromS3(filename,24*60)
   return {
    ...state,
    aiResponse:
    `# PDF Generated
    
    ** ${data?.title} **
    
   [Download PDF](${downloadUrl})
   
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
            aiResponse:`Failed to generate PDF`
        }

    }
}