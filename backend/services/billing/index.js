import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import router from "./routes/billing.routes.js"
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json())
app.use("/",router);


app.listen(port, "0.0.0.0", () => {
    console.log(`auth started at ${port}`);
    connectDb();
});