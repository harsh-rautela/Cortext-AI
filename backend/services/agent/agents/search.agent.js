import { checkAgentLimit } from "../config/agentLimit.js";
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent = async (state)=>{
    try {
        await checkAgentLimit(state.userId,"search")
        const results = await searchTool.invoke({
            query:state.prompt
        });
          await deductCredits(state.userId,"serach")
        return {
            ...state,
            searchResults:results,
            images: results.images
        }

    } catch(error){
        if(error?.status ==429){
            return  {
                ...state,
                aiResponse:error.data.message,
            searchResults:[],
            images: []
            }
        }
        return {
            ...state,
            searchResults:[],
            images: []
        }

    }
}