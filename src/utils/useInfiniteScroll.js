import { ref, onMounted, onUnmounted } from "vue"

export function useInfiniteScroll(callback) {
  const sentinel = ref(null)
  const intersectionObserver = ref(null)
  const loadingMore = ref(false)

  const handleIntersection = async (entries) => {
    const [entry] = entries
    if (entry.isIntersecting && !loadingMore.value) {
      try {
        loadingMore.value = true
        await callback()
      } catch (error) {
        console.error("Error in infinite scroll callback:", error)
      } finally {
        loadingMore.value = false
      }
    }
  }

  onMounted(() => {
    if (sentinel.value) {
      intersectionObserver.value = new IntersectionObserver(
        handleIntersection,
        {
          root: null,
          threshold: 1.0,
        },
      )
      intersectionObserver.value.observe(sentinel.value)
    }
  })

  onUnmounted(() => {
    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
    }
  })

  return {
    sentinel,
    loadingMore,
  }
}
