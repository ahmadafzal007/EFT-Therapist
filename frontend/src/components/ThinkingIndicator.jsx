"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function ThinkingIndicator() {
  const containerRef = useRef(null)
  const dotsRef = useRef(null)

  useEffect(() => {
    try {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      if (dotsRef.current && dotsRef.current.children.length) {
        gsap.to(dotsRef.current.children, {
          y: -3,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          duration: 0.4,
          ease: "power2.inOut",
        })
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex items-start gap-3">
      <div className="h-6 w-6 rounded-full bg-white text-[10px] text-gray-900 flex items-center justify-center">
        EFT
      </div>

      <div className="rounded-lg border border-gray-700 bg-black p-3 text-xs text-white">
        <div ref={dotsRef} className="flex h-4 items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
          <span className="ml-2 text-xs text-gray-400">Thinking...</span>
        </div>
      </div>
    </div>
  )
}