"use client"

import { createContext, useContext, useState } from "react"

const ChatContext = createContext(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content:
      "Welcome to your EFT therapy session. How are you feeling today? I'm here to guide you through some tapping techniques that can help with emotional healing.",
  },
]

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content) => {
    // Add user message
    const userMessage = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])

    // Set loading state
    setIsLoading(true)

    try {
      // Make API call to the backend
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Format the response from the backend
      const responseContent = `${data.response}

**Expert Guidance:**
${data.expert_guidance}

**Suggested Steps:**
${data.subtasks}`

      // Add assistant response
      const assistantMessage = { role: "assistant", content: responseContent }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error connecting to the EFT service. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const resetSession = async () => {
    setMessages(INITIAL_MESSAGES)
    try {
      const response = await fetch("http://localhost:8000/api/reset", {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`Failed to reset session on server: ${response.status}`)
      }
      console.log("Session reset successfully on both client and server")
    } catch (error) {
      console.error("Error resetting session on server:", error)
    }
  }

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, resetSession }}>
      {children}
    </ChatContext.Provider>
  )
}