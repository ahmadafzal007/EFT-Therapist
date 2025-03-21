"use client"

import { createContext, useContext, useState, useEffect } from "react"

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

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error("Error parsing stored messages:", error)
      }
    }
  }, [])

  // Store messages in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  const sendMessage = async (content) => {
    const userMessage = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8002/api/chat", {
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

      // Remove expert guidance and suggested steps details.
      const responseContent = data.response

      const assistantMessage = { role: "assistant", content: responseContent }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
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
    localStorage.removeItem("chatMessages") // Clear stored session

    try {
      const response = await fetch("http://localhost:8002/api/reset", {
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
