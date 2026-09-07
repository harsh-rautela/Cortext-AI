import api from "../../utils/axios"

export const verifyPayment = async (payload)=>{
    try {
        const {data}= await api.post("/billing/verify",payload);
        
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
}