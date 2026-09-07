import fs from "fs/promises";
import { getModel } from "../config/llm.Models.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { checkAgentLimit } from "../config/agentLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
// import { deductCredits } from "..."; // Add your actual import

export const imageRagAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId,"image")
        const llm = await getModel("imageAnalyzer");

        const imageBuffer = await fs.readFile(state.file.path);

        const base64image = imageBuffer.toString("base64");

        console.log("inside image rag");

        const messages = [
            new SystemMessage(`
                You are CortextAI image analyzer Agent.

                Rules:
                - Analyze only the uploaded image.
                - Answer the user's question accurately.
                - If text exists in the image, extract it.
                - If something is unclear, say so.
                - Use Markdown when helpful.
                - Do not hallucinate.
            `),

            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: state.prompt || "Analyze the image",
                    },
                    {
                        type: "image_url",

                        // FIX: iamge_url -> image_url
                        image_url: {
                            url: `data:${state.file.mimetype};base64,${base64image}`,
                        },
                    },
                ],
            }),
        ];

        const response = await llm.invoke(messages);

        console.log("after response" );
        console.log(response?.content)

        await deductCredits(state.userId, "vision");

        return {
            ...state,
            aiResponse: response?.content || `Failed to generate ` ,
        };

    } catch (error) {
        console.error("Image RAG Agent Error:", error);
         if(error?.status ==429){
            return  {
                ...state,
                aiResponse:error.data.message
            }
        }
        return {
            ...state,
            aiResponse: "Failed to analyze file",
        };

    } finally {
        if (state?.file?.path) {
            try {
                await fs.unlink(state.file.path);
            } catch (error) {
                console.error("Failed to delete uploaded file:", error);
            }
        }
    }
};
