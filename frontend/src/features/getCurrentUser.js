import api from '../../utils/axios.js'

const getCurrentUser = async ()=>{
    try{
        console.log("here")
        const {data}= await api.get('/me');
        return data;
    } catch(error){
        console.log(error)
        return null;
    }
}
export default getCurrentUser