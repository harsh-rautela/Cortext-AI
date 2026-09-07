// 
import { getModel } from "../config/llm.Models.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const visionAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"image")
    const llm = await getModel("image");

    const res = await llm.invoke(`
You are an elite AI image prompt engineer.

Convert the user's request into a highly detailed image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
`);

    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    console.log(imageUrl)
    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    await deductCredits(state.userId,"vision")
    const buffer = Buffer.from(imageRes.data);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(
      filename,
      buffer,
      "image/png"
    );

    // 24 hours
    const downloadUrl = await getFromS3(
  filename,
  24*60
);

return {
  ...state,
  aiResponse: `
![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})

*Link expires in 24 hours.*
`,
};

  } catch (error) {
    console.error("Vision Agent Error:", error);
     if(error?.status ==429){
            return  {
                ...state,
                aiResponse:error.data.message
            }
        }

    return {
      ...state,
      aiResponse: "Failed to generate image.",
    };
  }
};
