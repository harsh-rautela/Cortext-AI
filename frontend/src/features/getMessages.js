import api from "../../utils/axios"


const getMessages = async (id) => {
    try {
        const {data}= await api.get(`/chat/get-message/${id}`)
        return data;
    } catch(error){
        return []
    }
}

export default getMessages