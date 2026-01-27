export function useClickOutside(callback) {
  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".side-panel") &&
      !event.target.closest(".header-icon")
    ) {
      callback()
    }
  }
  
  return { handleClickOutside }
}