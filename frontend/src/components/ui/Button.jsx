"use client"

export function Button({
  children,
  className = "",
  disabled = false,
  size = "default",
  variant = "default",
  type = "button",
  onClick,
  ...props
}) {
  // Simplified button with explicit styling
  const style = {
    backgroundColor: variant === "default" ? "#333333" : "transparent",
    color: "#ffffff",
    border: variant === "outline" ? "1px solid #333333" : "none",
    borderRadius: "0.375rem",
    padding: size === "sm" ? "0.5rem 0.75rem" : "0.625rem 1rem",
    fontSize: "0.875rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  }

  if (size === "icon") {
    style.padding = "0"
    style.width = "2.5rem"
    style.height = "2.5rem"
  }

  return (
    <button type={type} className={className} style={style} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

