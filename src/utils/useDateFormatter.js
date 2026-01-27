export function useDateFormatter() {
  const formatTime = (timestamp) => {
    if (!timestamp) return "No time"
    try {
      return new Date(timestamp).toLocaleTimeString()
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Invalid time"
    }
  }

  const formatFullDate = (timestamp) => {
    if (!timestamp) return ""
    try {
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return "Invalid date"
    }
  }

  return {
    formatTime,
    formatFullDate,
  }
}
