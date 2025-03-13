import os
import google.generativeai as genai
from langchain.llms.base import LLM
from typing import Any, List, Optional, Dict

class GeminiLLM(LLM):
    """
    Custom LLM that uses the Gemini API via the Google GenAI client.
    GEMINI_API_KEY is loaded from the .env file.
    """
    def __init__(self):
        super().__init__()
        # Configure the Gemini API
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        
    @property
    def _llm_type(self) -> str:
        return "gemini"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Handle general queries differently
        if self._is_general_query(prompt):
            return self._handle_general_query(prompt)
            
        response = model.generate_content(prompt)
        return response.text

    def _is_general_query(self, prompt: str) -> bool:
        """Check if the prompt is a general greeting or simple question."""
        general_queries = [
            "hello", "hi", "hey", "greetings", "how are you", 
            "how's it going", "what's up", "good morning", 
            "good afternoon", "good evening", "help", "what is eft"
        ]
        
        prompt_lower = prompt.lower().strip()
        
        for query in general_queries:
            if prompt_lower.startswith(query) or prompt_lower == query:
                return True
        return False
        
    def _handle_general_query(self, prompt: str) -> str:
        """Provide a concise, friendly response to general queries."""
        prompt_lower = prompt.lower().strip()
        
        if any(greeting in prompt_lower for greeting in ["hello", "hi", "hey", "greetings"]):
            return "Hello! I'm your EFT Therapy Assistant. How are you feeling today? I'm here to help guide you through emotional freedom techniques."
        elif "how are you" in prompt_lower or "how's it going" in prompt_lower or "what's up" in prompt_lower:
            return "I'm here and ready to support you with EFT techniques. How are you feeling today? Is there something specific you'd like to work on?"
        elif any(greeting in prompt_lower for greeting in ["good morning", "good afternoon", "good evening"]):
            return "Thank you, and the same to you! I'm your EFT Therapy Assistant. How can I support your emotional wellbeing today?"
        elif "help" in prompt_lower:
            return ("I'm here to help you with Emotional Freedom Techniques (EFT). "
                    "You can share how you're feeling, describe emotional challenges, or ask for guidance on specific issues. "
                    "I'll provide personalized tapping sequences to help you process emotions and find relief.")
        elif "what is eft" in prompt_lower:
            return ("EFT (Emotional Freedom Techniques) is a powerful self-help method that combines elements of cognitive therapy with acupressure. "
                    "By tapping on specific meridian points while focusing on an issue, EFT helps release emotional blockages and reduce stress. "
                    "It's often called 'psychological acupressure' and can help with anxiety, stress, trauma, and other emotional challenges.")
        else:
            return "I'm your EFT Therapy Assistant. How can I support you today?"

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {
            "model": "gemini-pro",
            "temperature": 0.7,
        }
