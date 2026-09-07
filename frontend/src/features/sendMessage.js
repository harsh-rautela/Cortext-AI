import api from "../../utils/axios"

const sendMessage = async (payload) => {
  try {
    console.log("inside send message")
    const {data}= await api.post("/agent/chat",payload)
    return data;
  } catch(error){
    return null;
  }
}

export default sendMessage