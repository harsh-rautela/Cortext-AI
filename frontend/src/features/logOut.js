const logOut = async ()=>{
    try {
        const {data}= await api.get("/auth/logout");
    } catch(error){
        console.log(error)
    }
    
}
export default logOut