import { forwardRef } from "react"

export const ScrollArea = forwardRef(({ className = "", children, ...props }, ref) => {
  // Simplified scroll area with explicit styling
  const style = {
    position: "relative",
    overflow: "auto",
    height: "100%",
  }

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  )
})

ScrollArea.displayName = "ScrollArea"

