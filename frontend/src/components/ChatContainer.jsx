"use client"

import { useState, useRef, useEffect } from "react"
import { useChatContext } from "../context/ChatContext"
import { gsap } from "gsap"
import { Menu, Send } from "lucide-react"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { ChatMessage } from "./ChatMessage"

export function ChatContainer({ isSidebarOpen, setIsSidebarOpen }) {
  const { messages, sendMessage, isLoading } = useChatContext()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const formRef = useRef(null)

 
  

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Animate chat container on mount
  useEffect(() => {
    try {
      if (chatContainerRef.current) {
        gsap.from(chatContainerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power3.out",
        })
      }

      if (formRef.current) {
        gsap.from(formRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: 0.2,
          ease: "power3.out",
        })
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      const messageToSend = input;
      setInput("") // Clear the input area immediately
      await sendMessage(messageToSend)
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
        <button
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-md text-gray-400 hover:text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-medium text-white">EFT Therapy Session</h1>
        <div className="w-9 md:hidden"></div>
      </div>

      {/* Chat messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-auto no-scrollbar">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} index={index} />
          ))}

          {isLoading && <ThinkingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <form ref={formRef} onSubmit={handleSubmit} className="border-t border-gray-700 bg-black p-4">
        <div className="mx-auto flex max-w-2xl gap-2">
          <textarea
            className="min-h-10 max-h-32 resize-none text-xs w-full rounded-md border border-gray-700 bg-black p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button
            type="submit"
            className="h-10 w-10 shrink-0 rounded-md bg-black flex items-center justify-center text-white disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}