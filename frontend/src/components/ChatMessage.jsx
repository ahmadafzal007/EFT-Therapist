"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
// NEW: Import react-markdown
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ChatMessage({ message }) {
  const messageRef = useRef(null)

  useEffect(() => {
    try {
      if (messageRef.current) {
        gsap.from(messageRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          delay: 0.1,
          ease: "power3.out",
        })
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [])

  return (
    <div
      ref={messageRef}
      className={`flex items-start gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role !== "user" && (
        <div className="h-6 w-6 rounded-full bg-white text-[10px] text-black flex items-center justify-center">
          EFT
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-lg p-3 text-xs border border-gray-700 ${
          message.role === "user" ? "bg-black text-white" : "bg-black text-white"
        }`}
      >
        {/* Use ReactMarkdown to parse the message content as Markdown */}
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert">
          {message.content}
        </ReactMarkdown>
      </div>

      {message.role === "user" && (
        <div className="h-6 w-6 rounded-full bg-white text-[10px] text-black flex items-center justify-center">
          You
        </div>
      )}
    </div>
  )
}