export function Card({ className = "", children, ...props }) {
    // Simplified card with explicit styling
    const style = {
      backgroundColor: "#1e1e2e",
      color: "#ffffff",
      border: "1px solid #333333",
      borderRadius: "0.5rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }
  
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    )
  }
  
  