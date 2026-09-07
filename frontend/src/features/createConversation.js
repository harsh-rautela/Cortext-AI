import api from "../../utils/axios"

export const createConversation = async ()=>{
    try {
        const {data}= await api.get("/chat/create-conversation");
        return data;
    } catch(error){
        console.log(error);
        return [];
    }

}