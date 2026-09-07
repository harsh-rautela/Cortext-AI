import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llm.Models.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {

    await checkAgentLimit(state.userId,"coding")
  const intentModel = await getModel("intent");
  const llm = await getModel("coding");
  const intentResponse = await intentModel.invoke(
    ` You are an intent classifier.
        Return ONLY one of these values.
        
        CODE_GENERATION
        CODE_REVIEW 
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION


        User Request:
        ${state.prompt}
        `,
  );
  const intent = intentResponse.content;

  if (intent == "CODE_GENERATION") {
    const prompt = `
       You are Cortex AI Coding Agent.
       
       Generate the requested Coding Agent.
       
       Default stack:
       -HTML
       -CSS
       -JavaScript
       Use React/Next.js / Vue ONLY if explicitely requested.
       
       Rules:
       - Responsive
       - Modern UI
       - CSS Variables
       - Filebox/Grid
       - Smooth scroll
       - Hover Effects
       - Beautiful spacing
       - Single page unless user asks otherwise
         

       IMAGES
       =============================
       Always use real Unsplash images for the project. 
       Never use placeholders. Use Unsplash API to fetch images.
       Do not use Lorem Picsum or any other placeholder image service.
       Return ONLY valid JSON.
       
       Schema:
       
       {
        "files":[
            {  "name":"index.html",
                "content":"..."
            },
            {  "name":"style.css",
                "content":"..."
            },
            {   "name":"script.js",
                "content":"..."
            }
        ]
       }


       Rules:
       - Output must start with {
       - Output must end with }
       - No markdown
       - No extra text
       - No \' \' \ '
       - Never mention intent
      
      User Request:
      ${state.prompt}
       `;
      const res = await llm.invoke(prompt)
      const data = JSON.parse(res.content); 
        await deductCredits(state.userId,"coding")
      return {
        ...state,
        aiResponse:"Code Generated Successfully.",
        artifacts:[
            {
                id:Date.now(),
                type:"Project",
                files:data.files || [],
                title:state.prompt
            }
        ]
      }
  }
  const res = await llm.invoke(`
    The user's request is:
    ${intent}
    
    Return Markdown only.

    Never generate project files.

    Use headings like:

    # Overview 

    ## Explanations

    ## Problems

    ## Improvements 

    ## Best Practices

    ## Optimized code (if required)

    User Request:
    ${state.prompt}
    `)
    const data = res.content;
    await deductCredits(state.userId,"coding")
    return {
        ...state,
        aiResponse:data,
        artifacts:[]
    }
};

