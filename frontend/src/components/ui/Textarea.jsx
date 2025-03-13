export function Textarea({ className = "", ...props }) {
    // Simplified textarea with explicit styling
    const style = {
      display: "flex",
      minHeight: "80px",
      width: "100%",
      borderRadius: "0.375rem",
      border: "1px solid #333333",
      backgroundColor: "#1e1e2e",
      color: "#ffffff",
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
    }
  
    if (props.disabled) {
      style.opacity = 0.5
      style.cursor = "not-allowed"
    }
  
    return <textarea className={className} style={style} {...props} />
  }
  
  