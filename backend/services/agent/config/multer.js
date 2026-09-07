import fs from "fs"
import path from "path"
import multer from "multer"
import { Destination$ } from "@aws-sdk/client-s3"
const uploadDir=path.resolve("./temp")
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,uploadDir)
    },
    filename(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const fileFilter =(req,file,cb)=>{
    if(file.mimetype =="application/pdf" || file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        
    cb(new Error("Only pdf and images allowed"))
    }
}

export default multer({storage,fileFilter,limits:{
    fileSize:20*1024*1024
}})