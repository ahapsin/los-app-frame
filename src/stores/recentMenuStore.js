import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useRecentMenuStore = defineStore("recentMenu", () => {

  const recentMenus = ref([])

  const addRecent = (menu) => {
    recentMenus.value = recentMenus.value.filter(
      item => item.id !== menu.id
    )

    recentMenus.value.unshift(menu)

    if (recentMenus.value.length > 5) {
      recentMenus.value = recentMenus.value.slice(0, 5)
    }
  }

  const removeRecent = (id) => {
    recentMenus.value = recentMenus.value.filter(
      item => item.id !== id
    )
  }

  const clearRecent = () => {
    recentMenus.value = []
  }

  // 🔥 persist
  watch(recentMenus, (val) => {
    localStorage.setItem("recentMenus", JSON.stringify(val))
  }, { deep: true })

  const saved = localStorage.getItem("recentMenus")
  if (saved) {
    recentMenus.value = JSON.parse(saved)
  }

  return {
    recentMenus,
    addRecent,
    removeRecent,
    clearRecent
  }
})
