import logging
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from typing import Dict, Any, Optional, Callable
from modules.gemini_llm import GeminiLLM

logger = logging.getLogger(__name__)

class EFTTherapySystem:
    def __init__(self):
        logger.debug("Initializing EFTTherapySystem.")
        self.llm = GeminiLLM()
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            return_messages=True,
            k=10  # Keep last 10 messages
        )
        
        self.decomposition_prompt = PromptTemplate(
            input_variables=["input", "chat_history"],
            template="""You are a Task Decomposition Specialist for EFT (Emotional Freedom Techniques) therapy.
            
Your role is to break down complex EFT queries into clear, actionable subtasks.

Given the following query and conversation history, break down the query into specific therapeutic needs:

Query: {input}

Conversation History: {chat_history}

List each subtask on a new line, focusing on key therapeutic needs. Be sensitive to emotional cues and underlying issues:
"""
        )
        self.decomposition_chain = LLMChain(llm=self.llm, prompt=self.decomposition_prompt)
        
        self.expert_prompt = PromptTemplate(
            input_variables=["input", "subtasks", "chat_history"],
            template="""You are an EFT Therapy Expert with years of experience in Emotional Freedom Techniques.
            
You help patients address emotional challenges through tapping techniques, combining clinical expertise with warm empathy.

Based on the following subtasks identified for this query, provide expert EFT guidance addressing each component:

Original Query: {input}

Subtasks:
{subtasks}

Conversation History: {chat_history}

For each subtask, provide:
1. A brief validation of the feeling or concern
2. Clear tapping instructions with specific phrases to say during tapping
3. A comforting rationale for why this approach helps

Use a warm, conversational tone as if you're speaking directly to the person. Include gentle encouragement and normalize their experience:
"""
        )
        self.expert_chain = LLMChain(llm=self.llm, prompt=self.expert_prompt)
        
        self.coordinator_prompt = PromptTemplate(
            input_variables=["input", "expert_guidance", "chat_history"],
            template="""You are an EFT Session Coordinator skilled at creating conversational, empathetic therapeutic responses.
            
Your task is to create a cohesive, empathetic response that feels like a real therapist is talking directly to the client.

Original Query: {input}

Expert Guidance:
{expert_guidance}

Conversation History: {chat_history}

Create a response that:
1. Opens with a warm, personalized greeting that acknowledges their feelings
2. Presents the EFT guidance in a conversational, easy-to-follow format
3. Uses supportive language and occasional questions to engage them
4. Closes with encouragement and an invitation to share how they feel after trying the techniques

The response should feel like a caring conversation, not a clinical instruction manual. Use natural language with some variation in sentence structure, occasional gentle questions, and empathetic observations:
"""
        )
        self.coordinator_chain = LLMChain(llm=self.llm, prompt=self.coordinator_prompt)
    
    def process_query(self, user_query: str, progress_callback: Optional[Callable] = None) -> Dict[str, str]:
        logger.debug(f"Processing query: {user_query}")
        memory_vars = self.memory.load_memory_variables({})
        logger.debug(f"Loaded memory variables: {memory_vars}")
        chat_history = memory_vars.get("chat_history", "")
        
        if self.llm._is_general_query(user_query):
            response = self.llm._handle_general_query(user_query)
            logger.debug(f"General query response: {response}")
            self.memory.save_context({"input": user_query}, {"output": response})
            return {
                "subtasks": "General query",
                "expert_guidance": "Direct response",
                "final_response": response
            }
        
        if progress_callback:
            progress_callback("Listening to your concerns...", 0.2)
        
        decomposition_result = self.decomposition_chain.run({
            "input": user_query,
            "chat_history": chat_history
        })
        logger.debug(f"Decomposition result: {decomposition_result}")
        
        if progress_callback:
            progress_callback("Preparing personalized EFT guidance...", 0.5)
        
        expert_result = self.expert_chain.run({
            "input": user_query,
            "subtasks": decomposition_result,
            "chat_history": chat_history
        })
        logger.debug(f"Expert result: {expert_result}")
        
        if progress_callback:
            progress_callback("Crafting a supportive response for you...", 0.8)
        
        final_result = self.coordinator_chain.run({
            "input": user_query,
            "expert_guidance": expert_result,
            "chat_history": chat_history
        })
        logger.debug(f"Final result: {final_result}")
        
        if progress_callback:
            progress_callback("Ready with your guidance", 1.0)
        
        self.memory.save_context({"input": user_query}, {"output": final_result})
        logger.debug("Updated conversation memory with final response.")
        
        return {
            "subtasks": decomposition_result,
            "expert_guidance": expert_result,
            "final_response": final_result
        }
