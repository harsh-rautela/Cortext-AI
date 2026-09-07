import api from "../../utils/axios"

export const getConversations = async ()=>{
    try {
        const {data}= await api.get("/chat/get-conversation");
        return data;
    } catch(error){
        console.log(error);
        return [];
    }

}