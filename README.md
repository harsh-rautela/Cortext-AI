AI Multi-Agent Chat Platform
A full-stack, microservices-based AI chat application (ChatGPT/Claude-style) with an intelligent agent router that dynamically dispatches user requests to specialized AI agents — chat, web search, code generation, PDF/PPT creation, document RAG, and image analysis. Includes Firebase authentication, Redis-backed sessions & rate limiting, a Razorpay credit/billing system, and a React frontend with a code-artifact viewer.

✨ Features
Intelligent agent routing — an LLM-based router (built with LangGraph) classifies each prompt and routes it to the right specialized agent, or infers the agent automatically from an uploaded file's MIME type (PDF → RAG agent, image → vision agent).
Multiple specialized agents
Chat — general conversation and Q&A
Search — live web search grounding via Tavily
Coding — code generation, debugging, and architecture help
PDF / PPT generation — creates downloadable PDF and PowerPoint files from a conversation
PDF RAG — chunks and embeds uploaded PDFs (Qdrant vector store) and answers questions using retrieved context
Image RAG / Vision — analyzes uploaded images and generates images
Conversations & messages — persisted chat history with conversation titles, stored in MongoDB
Authentication — Firebase ID token verification with server-side sessions stored in Redis (HTTP-only cookies)
Credits & billing — Razorpay checkout flow, plan-based credit allocation, and per-agent credit deduction
Rate limiting — per-user, per-agent request limits enforced via Redis
File storage — uploads (PDFs/images) stored in AWS S3
Code artifacts — a Monaco-editor-powered artifact viewer in the frontend for generated code, similar to Claude/ChatGPT canvas
API Gateway — a single entry point that authenticates requests and proxies them to the appropriate backend microservice
🏗️ Architecture
The backend is split into independently deployable microservices behind an API gateway, all orchestrated with Docker Compose.

                            ┌─────────────┐
                            │   Frontend   │  (React + Vite)
                            └──────┬───────┘
                                   │
                            ┌──────▼───────┐
                            │   Gateway    │  :8000  (auth check + proxy)
                            └──┬───┬───┬───┘
                   ┌───────────┘   │   └───────────┐
             ┌─────▼────┐   ┌──────▼─────┐   ┌──────▼─────┐   ┌──────────┐
             │   Auth   │   │   Agent    │   │  Billing   │   │   Chat   │
             │  :8001   │   │   :8002    │   │   :8003    │   │  :8004   │
             └────┬─────┘   └─────┬──────┘   └─────┬──────┘   └────┬─────┘
                  │               │                │               │
             ┌────▼────┐   ┌──────▼──────┐   ┌──────▼─────┐   ┌─────▼────┐
             │ MongoDB │   │ Redis /     │   │  MongoDB   │   │ MongoDB  │
             │ Firebase│   │ Qdrant / S3 │   │  Razorpay  │   │          │
             └─────────┘   └─────────────┘   └────────────┘   └──────────┘
Services:

Service	Port	Responsibility
gateway	8000	Verifies session cookies, forwards x-user-id header, proxies to downstream services
auth	8001	Firebase login/logout, session management, credit deduction, plan updates
agent	8002	LangGraph agent router + specialized agents (chat, search, coding, pdf, ppt, vision, RAG)
billing	8003	Razorpay order creation & payment verification, plan management
chat	8004	Conversation and message persistence
redis	6379	Sessions, rate limiting, agent state
A shared Redis client (backend/shared/redis) is used across services for sessions and rate limiting.

🛠️ Tech Stack
Backend

Node.js (ES modules) + Express 5
LangGraph + LangChain for agent orchestration
LLM providers: Groq (gpt-oss-120b), OpenRouter (DeepSeek), Google Gemini
Tavily API for web search
Qdrant for vector storage / RAG
MongoDB (via Mongoose) for persistence
Redis for sessions, caching, and rate limiting
Firebase Admin SDK for authentication
AWS S3 for file storage
Razorpay for payments
pdfkit / pptxgenjs / pdf-parse for document generation and parsing
Frontend

React 19 + Vite
Redux Toolkit for state management
Tailwind CSS
Firebase (client SDK) for auth
@monaco-editor/react for the code-artifact viewer
react-markdown + remark-gfm + react-syntax-highlighter for rendering AI responses
Infrastructure

Docker & Docker Compose for local orchestration
📁 Project Structure
.
├── backend/
│   ├── gateway/                 # API gateway (auth check + proxy)
│   └── services/
│       ├── auth/                # Firebase auth, sessions, credits
│       ├── agent/                # LangGraph router + AI agents
│       │   ├── agents/           # chat, search, coding, pdf, ppt, vision, RAG agents
│       │   ├── graph/            # StateGraph definition, router, shared state
│       │   └── config/           # LLM models, vector DB, S3, rate limits
│       ├── billing/              # Razorpay orders & plans
│       └── chat/                 # Conversations & messages
└── frontend/
    ├── src/
    │   ├── components/           # Chat UI, sidebar, billing drawer, artifact viewer
    │   ├── features/             # API calls (conversations, messages, payments, auth)
    │   ├── pages/
    │   └── redux/                # Redux slices (user, conversation, messages)
    └── utils/                    # Axios instance, Firebase client config
🚀 Getting Started
Prerequisites
Node.js 18+
Docker & Docker Compose (recommended for running everything together)
Accounts/API keys for: Firebase, MongoDB (Atlas or local), Redis, Groq, OpenRouter, Google (Gemini), Tavily, Qdrant, AWS S3, Razorpay
1. Clone and configure environment variables
Each service has its own .env.example — copy each to .env and fill in the values:

cp backend/gateway/.env.example backend/gateway/.env
cp backend/services/auth/.env.example backend/services/auth/.env
cp backend/services/agent/.env.example backend/services/agent/.env
cp backend/services/billing/.env.example backend/services/billing/.env
cp backend/services/chat/.env.example backend/services/chat/.env
cp frontend/.env.example frontend/.env
Key variables to fill in (see each .env.example for the complete list):

auth: MONGODB_URI, FIREBASE_* credentials
agent: MONGODB_URI, GROQ_API_KEY, OPENROUTER_API_KEY, GOOGLE_API_KEY, TAVILY_API_KEY, QDRANT_URL, QDRANT_API_KEY, AWS_*, REDIS_URL, CHAT_SERVICE, AUTH_SERVICE
billing: MONGODB_URI, RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY, AUTH_SERVICE
chat: MONGODB_URI
gateway: PORT, FRONTEND_URL, AUTH_SERVICE, CHAT_SERVICE, AGENT_SERVICE, BILLING_SERVICE
frontend: Firebase client config, API base URL
2. Run services individually (development)
# from each service directory:
npm install
npm run dev
Start in this order: redis (via cloud) → auth, agent, billing, chat → gateway.

3. Run the frontend
cd frontend
npm install
npm run dev
The frontend will be available at http://localhost:5173 (default Vite port) and should point to the gateway (http://localhost:8000) as its API base URL.

🔑 How Agent Routing Works
A user sends a prompt (optionally with a file) to POST /api/agent.
If a file is attached, the router immediately routes based on MIME type (application/pdf → PDF RAG agent, image/* → image analysis agent).
Otherwise, an LLM call classifies the prompt into one of: chat, search, coding, pdf, ppt, vision.
The corresponding LangGraph node executes: search results are fed back into chat for a grounded answer, while coding, pdf, ppt, vision, and the RAG agents terminate the graph directly with their own output.
Each agent call checks Redis-based rate limits and deducts credits from the user's account before/after execution.
💳 Credits & Plans
Plan	Price (INR)	Credits	Validity
Free	₹0	100	30 days
Starter	₹199	500	30 days
Pro	₹499	1000	30 days
Agent usage costs vary by type (e.g., chat = 1 credit, search = 5, coding/pdf/ppt/vision = 10), deducted per request.

📌 Notes
This is a personal/learning project structure — some error handling and validation is still a work in progress (see inline TODOs in the codebase).
Payment integration is configured for Razorpay with INR currency; adapt billing/config/plans.js and razorpay.js for other currencies/providers if needed.
Vector storage for RAG uses Qdrant; make sure a Qdrant instance (cloud or self-hosted) is reachable via QDRANT_URL.
📄 License

This project is currently available for educational and development purposes.


👨‍💻 Author

Harsh Rautela

GitHub: https://github.com/harsh-rautela

Project: https://github.com/harsh-rautela/CortexAI-v2

Built with ❤️ using R
