import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js";
dotenv.config();

const port = process.env.PORT || 8002;

const app = express();
app.use(express.json())
app.use("/",router);
app.get("/",(req,res)=>{
    res.send("Happy Birthday from chat");
})

app.listen(port, "0.0.0.0", () => {
    console.log(`chat started at ${port}`);
    connectDb();
});