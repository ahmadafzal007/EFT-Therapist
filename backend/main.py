import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from modules.eft_system import EFTTherapySystem
from langchain.schema import HumanMessage, AIMessage  # For type checking messages
import os
from dotenv import load_dotenv
from langchain.memory import ConversationBufferWindowMemory  # Import for reinitializing memory

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="EFT Therapist API",
    description="API for EFT Therapy chatbot system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite development server URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EFT System
eft_system = EFTTherapySystem()

# Pydantic models for request/response validation
class Message(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str
    subtasks: str
    expert_guidance: str

class ErrorResponse(BaseModel):
    error: str
    status: str

@app.get("/")
async def read_root():
    logger.debug("Received request for root endpoint.")
    return {"status": "ok", "message": "EFT Therapist API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(message: Message):
    logger.debug(f"Received chat message: {message.content}")
    try:
        result = eft_system.process_query(message.content)
        logger.debug(f"Chat response: {result}")
        return ChatResponse(
            response=result["final_response"],
            subtasks=result["subtasks"],
            expert_guidance=result["expert_guidance"]
        )
    except Exception as e:
        logger.exception("Error processing chat message.")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    """Return the chat history"""
    try:
        logger.debug("Fetching chat history.")
        memory_vars = eft_system.memory.load_memory_variables({})
        logger.debug(f"Loaded memory variables: {memory_vars}")
        chat_history = memory_vars.get("chat_history", [])
        if chat_history is None:
            chat_history = []
        messages = []

        if isinstance(chat_history, str):
            logger.debug("Chat history is a string.")
            messages.append({"role": "assistant", "content": chat_history})
        elif isinstance(chat_history, list):
            logger.debug(f"Chat history is a list with {len(chat_history)} messages.")
            for idx, msg in enumerate(chat_history):
                try:
                    content = msg.content if hasattr(msg, "content") else str(msg)
                    logger.debug(f"Message {idx} type: {msg.__class__.__name__ if hasattr(msg, '__class__') else type(msg)}")
                    if isinstance(msg, HumanMessage):
                        role = "user"
                    elif isinstance(msg, AIMessage):
                        role = "assistant"
                    else:
                        role = "assistant"
                    logger.debug(f"Message {idx}: role={role}, content={content}")
                    messages.append({"role": role, "content": content})
                except Exception as inner_e:
                    logger.exception(f"Error processing message {idx}: {inner_e}")
        else:
            logger.debug(f"Chat history has unrecognized type: {type(chat_history)}")
        return {"history": messages}
    except Exception as e:
        logger.exception("Error fetching chat history.")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reset")
async def reset_session():
    try:
        logger.debug("Resetting chat session.")
        # Check if the memory object supports clear(); if not, reinitialize it.
        if hasattr(eft_system.memory, "clear") and callable(eft_system.memory.clear):
            eft_system.memory.clear()
            logger.debug("Called memory.clear() successfully.")
        else:
            logger.debug("Memory object does not support clear(); reinitializing memory.")
            eft_system.memory = ConversationBufferWindowMemory(
                memory_key="chat_history",
                return_messages=True,
                k=10
            )
        logger.debug("Chat session reset successfully.")
        return {"message": "Session reset successfully"}
    except Exception as e:
        logger.exception("Error resetting chat session.")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
