import api from "../../utils/axios"
export const upDateConversation = async (payload)=>{
    try {
        const {data}= await api.post("/chat/update-conversation",payload)
        return data;
    } catch(error){
        return [];

    }
}