"use client"

import { useEffect, useRef } from "react"
import { useChatContext } from "../context/ChatContext"
import { gsap } from "gsap"
import { Info, RefreshCw, X, Zap, Heart, Brain, Sparkles } from "lucide-react"

export function Sidebar({ isOpen, setIsOpen }) {
  const { resetSession } = useChatContext()
  const sidebarRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Animate sidebar elements on mount
    try {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.3,
        })
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [])

  useEffect(() => {
    // Animate sidebar on open/close for mobile
    try {
      if (sidebarRef.current) {
        if (isOpen) {
          gsap.to(sidebarRef.current, {
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          })
        } else {
          gsap.to(sidebarRef.current, {
            x: "-100%",
            duration: 0.3,
            ease: "power2.in",
          })
        }
      }
    } catch (error) {
      console.error("GSAP animation error:", error)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-black shadow-xl transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
          <h2 className="text-sm font-semibold text-white">EFT Therapist</h2>
          <button
            className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <SidebarContent resetSession={resetSession} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-gray-700 bg-black md:block">
        <div className="flex h-14 items-center justify-center border-b border-gray-700 px-4">
          <h2 className="text-sm font-semibold text-white">EFT Therapist</h2>
        </div>
        <SidebarContent resetSession={resetSession} />
      </div>
    </>
  )
}

function SidebarContent({ resetSession }) {
  const contentRef = useRef(null)

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-auto">
      <div ref={contentRef} className="p-4">
        <div className="mb-4 p-3 rounded-lg bg-black border-l-4 border-l-white">
          <p className="text-xs text-white">
            Welcome to your EFT therapy session. I'm here to guide you through emotional healing using tapping
            techniques.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <h3 className="text-xs font-medium uppercase text-gray-400">About EFT</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Zap className="mt-0.5 h-4 w-4 text-white" />
              <div>
                <p className="text-xs font-medium text-white">What is EFT?</p>
                <p className="text-xs text-gray-400">
                  Emotional Freedom Technique combines cognitive elements with acupressure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Heart className="mt-0.5 h-4 w-4 text-white" />
              <div>
                <p className="text-xs font-medium text-white">Benefits</p>
                <p className="text-xs text-gray-400">
                  Reduces anxiety, stress, and negative emotions through tapping
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Brain className="mt-0.5 h-4 w-4 text-white" />
              <div>
                <p className="text-xs font-medium text-white">How it works</p>
                <p className="text-xs text-gray-400">Tapping on meridian points while focusing on specific issues</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 text-white" />
              <div>
                <p className="text-xs font-medium text-white">Get started</p>
                <p className="text-xs text-gray-400">
                  Share your feelings and follow the guided tapping instructions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-400" />
          <p className="text-xs text-gray-400">All conversations are private and secure</p>
        </div>

        <div className="mt-4">
          <button
            className="w-full text-xs rounded-md px-3 py-2 bg-transparent border border-gray-700 text-white hover:bg-black"
            onClick={resetSession}
          >
            <RefreshCw className="mr-2 h-3 w-3 inline" />
            Reset Session
          </button>
        </div>
      </div>
    </div>
  )
}