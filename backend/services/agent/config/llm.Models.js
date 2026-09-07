import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
import {ChatOpenRouter} from "@langchain/openrouter"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

dotenv.config()

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
    temperature: 0,
    maxRetries: 2,
});

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
})

const openrouter = new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
});
export const getModel=async (agent)=>{
    switch (agent) {
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding":
            return openrouter;
        case "imageAnalyzer":
            return gemini;
        default:
            return groq
    }
}