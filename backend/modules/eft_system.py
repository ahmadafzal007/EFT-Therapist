import logging
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from typing import Dict, Optional, Callable
from modules.gemini_llm import GeminiLLM

logger = logging.getLogger(__name__)

class EFTTherapySystem:
    def __init__(self):
        logger.debug("Initializing EFTTherapySystem.")
        self.llm = GeminiLLM()
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            return_messages=True,
            k=10  # Keeps last 10 messages in memory
        )

        # Internal decomposition prompt (for processing only)
        self.decomposition_prompt = PromptTemplate(
            input_variables=["input", "chat_history"],
            template="""You are a Task Decomposition Specialist for EFT therapy.
Your role is to understand the user's request and, if necessary, break it down into elements that can help generate a thoughtful response. Do not include these internal details in the final output.

User Query: {input}
Conversation History: {chat_history}

(Internal note: Keep this breakdown internal.)
"""
        )
        self.decomposition_chain = LLMChain(llm=self.llm, prompt=self.decomposition_prompt)

        # Internal expert prompt (to produce supportive guidance)
        self.expert_prompt = PromptTemplate(
            input_variables=["input", "subtasks", "chat_history"],
            template="""You are an EFT Therapy Expert. Provide supportive guidance in a natural, conversational tone.
User Query: {input}

(Internal note: Use any internal breakdown to inform your guidance, but do not include internal instructions in the output.)
"""
        )
        self.expert_chain = LLMChain(llm=self.llm, prompt=self.expert_prompt)

        # Updated coordinator prompt that produces the final conversational response
        self.coordinator_prompt = PromptTemplate(
            input_variables=["input", "expert_guidance", "chat_history"],
            template="""You are an EFT Therapist engaging in a genuine conversation with the user. Your role is to respond with empathy, clarity, and logical guidance that directly addresses the user's query. Tailor your response as follows:
- If the user greets you (e.g., "hello"), respond warmly and briefly introduce your role.
- If the user asks "who are you", clearly state that you are an EFT Therapist designed to help with emotional well-being, and provide a brief explanation of EFT.
- For other queries, offer supportive guidance that acknowledges the user's feelings and offers actionable suggestions if appropriate.
Do not include any internal instructions, breakdowns, or extraneous tapping exercises unless clearly needed.

User Query: {input}
Expert Guidance: {expert_guidance}
Conversation History: {chat_history}

Craft a final response that:
1. Is logically coherent and directly addresses the user's query.
2. Avoids unnecessary repetition or generic tapping instructions.
3. Clearly identifies your role when asked.
4. Maintains a warm, empathetic, and conversational tone.
Ensure the response is natural and contextually appropriate.
"""
        )
        self.coordinator_chain = LLMChain(llm=self.llm, prompt=self.coordinator_prompt)

    def process_query(self, user_query: str, progress_callback: Optional[Callable] = None) -> Dict[str, str]:
        logger.debug(f"Processing query: {user_query}")
        memory_vars = self.memory.load_memory_variables({})
        chat_history = memory_vars.get("chat_history", "")

        if progress_callback:
            progress_callback("Processing your message...", 0.3)

        # Internal step: decompose the query (not exposed to the user)
        decomposition_result = self.decomposition_chain.run({
            "input": user_query,
            "chat_history": chat_history
        })
        logger.debug(f"Decomposition result (internal): {decomposition_result}")

        if progress_callback:
            progress_callback("Formulating EFT guidance...", 0.6)

        # Internal step: generate expert EFT guidance (not exposed to the user)
        expert_result = self.expert_chain.run({
            "input": user_query,
            "subtasks": decomposition_result,
            "chat_history": chat_history
        })
        logger.debug(f"Expert guidance (internal): {expert_result}")

        if progress_callback:
            progress_callback("Finalizing response...", 0.9)

        # Final step: produce a natural, conversational reply
        final_result = self.coordinator_chain.run({
            "input": user_query,
            "expert_guidance": expert_result,
            "chat_history": chat_history
        })
        logger.debug(f"Final result: {final_result}")

        if progress_callback:
            progress_callback("Response ready.", 1.0)

        # Save conversation for continuity
        self.memory.save_context({"input": user_query}, {"output": final_result})
        logger.debug("Updated conversation memory with final response.")

        return {
            "final_response": final_result
        }
