"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "./Sidebar"
import { ChatContainer } from "./ChatContainer"
import { gsap } from "gsap"

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    // Initial animation
    try {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <ChatContainer isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </div>
  )
}