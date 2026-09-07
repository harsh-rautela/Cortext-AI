import proxy from "express-http-proxy"
const proxyWithHeader = (serviceUrl)=>{
    return proxy(serviceUrl,{
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            if(srcReq.user){
            proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
            }
            return proxyReqOpts
        }
    })
}
export default proxyWithHeader