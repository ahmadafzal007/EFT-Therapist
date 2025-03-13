export function Avatar({ className = "", children, ...props }) {
    // Simplified avatar with explicit styling
    const style = {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "9999px",
      backgroundColor: "#333333",
      color: "#ffffff",
      overflow: "hidden",
    }
  
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    )
  }
  
  