import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import { protect } from "./middleware/auth.middleware.js"
import getCurrent from "./controllers/user.controller.js"
import proxyWithHeader from "./utils/proxyWithHeader.js"
import redis from "./utils/redis.js"
import morgan from "morgan"
dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(morgan("dev"))
app.use(cookieParser());
app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/chat",protect,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent",protect,proxyWithHeader(process.env.AGENT_SERVICE))
app.use("/api/billing",protect,proxyWithHeader(process.env.BILLING_SERVICE))
app.get("/api/me",protect,getCurrent)
app.get("/",(req,res)=>{
    res.json("Happy Birthday");
})
app.listen(port, "0.0.0.0", () => {
    console.log(`gateway started at ${port}`);
});