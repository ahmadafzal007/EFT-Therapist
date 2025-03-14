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
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {
            "model": "gemini-pro",
            "temperature": 0.7,
        }
