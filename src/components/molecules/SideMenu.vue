<template>
    <div>
        <n-input @click="showModal = !showModal" placeholder="cari" class="z-10" readonly>
            <template #prefix>
                <v-icon name="bi-search"></v-icon>
            </template>
            <template #suffix>
                <n-tag size="small" round disabled>Ctrl+Space</n-tag>
            </template>
        </n-input>
        <DisclosMenu :menus="listMenu.response">
        </DisclosMenu>
        <!-- <pre>{{ listMenu.response }}</pre> -->
    </div>
    <div v-if="suspense">
        <DisclosMenuSusp />
    </div>
    <n-modal v-model:show="showModal">
        <n-card class="w-1/2">
            <n-input v-model:value="keyword" placeholder="Cari menu...">
                <template #suffix>
                    <v-icon name="bi-search" />
                </template>
            </n-input>
            <div v-if="!keyword && recentStore.recentMenus.length">
                <div class="flex justify-between items-center p-2">
                    <p class="text-xs opacity-50">Terbaru</p>
                    <button class="text-xs text-red-500" @click="recentStore.clearRecent()">
                        Hapus Semua
                    </button>
                </div>

                <n-list hoverable clickable>
                    <n-list-item v-for="item in recentStore.recentMenus" :key="item.id">
                        <div class="flex justify-between w-full items-center">
                            <div class="flex gap-2" @click="goTo(item)">
                                <v-icon :name="item.icon"></v-icon>
                                <span>
                                    {{ item.label }}
                                </span>
                            </div>
                            <div class="flex gap-2">
                                <n-button size="small" text circle >
                                    <v-icon name="bi-arrow-counterclockwise"></v-icon>
                                </n-button>
                                <n-button size="small" secondary circle class="text-xs text-red-400 cursor-pointer"
                                    @click.stop="recentStore.removeRecent(item.id)">
                                    ✕
                                </n-button>
                            </div>
                        </div>
                    </n-list-item>
                </n-list>
            </div>
            <n-list hoverable clickable>
                <n-list-item v-for="item in filteredMenus" :key="item.id" @click="goTo(item)">
                    <div class="flex justify-between w-full capitalize" v-if="item.type === 'child'">
                        <div class="flex gap-2">
                            <v-icon :name="item.icon"></v-icon>
                            <span>
                                {{ item.label }}
                            </span>
                        </div>
                        <span v-if="item.type === 'child'" class="text-xs opacity-60">
                            {{ item.parent }}
                        </span>
                    </div>
                    <div v-else class="text-xs opacity-60">
                        {{ item.label }}
                    </div>
                </n-list-item>
            </n-list>
        </n-card>
    </n-modal>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import DisclosMenu from "../molecules/DisclosMenu.vue";
import DisclosMenuSusp from "../molecules/DisclosMenuSusp.vue";
import router from "../../router/index.js";
import { useMagicKeys } from "@vueuse/core";
import { useRecentMenuStore } from "../../stores/recentMenuStore";

const recentStore = useRecentMenuStore()
const keys = useMagicKeys()

const showModal = ref(false)

// ⬇️ ini penting
watch(keys.ctrl_space, (v) => {
    if (v) {
        showModal.value = !showModal.value
    }
})

const goTo = (item) => {
    recentStore.addRecent(item)
    showModal.value = false
    keyword.value = ""
    router.push({ path: item.route })
}

const keyword = ref("")

const filteredMenus = computed(() => {
    let data = flatMenus.value

    if (keyword.value) {
        data = data.filter(item =>
            item.label
                .toLowerCase()
                .includes(keyword.value.toLowerCase())
        )
    }

    return data.slice(0, 5) // 🔥 LIMIT 5
})
const flatMenus = computed(() => {
    const result = []

    listMenu.response.forEach(menu => {
        const parentRoute = menu.menuitem.routename

        // parent
        result.push({
            id: menu.menuid,
            label: menu.menuitem.labelmenu,
            route: parentRoute,
            type: "parent"
        })

        // submenu
        menu.menuitem.submenu.forEach(sub => {
            result.push({
                id: sub.subid,
                label: sub.sublabel,
                icon: sub.leading[0],
                route: parentRoute + sub.subroute,
                type: "child",
                parent: menu.menuitem.labelmenu
            })
        })
    })

    return result
})
const suspense = ref(false);
const listMenu = reactive(
    {
        message: "",
        status: "",
        response: []
    }
);


const apibase = import.meta.env.VITE_APP_API_BASE;

const token = localStorage.getItem("token");

const config = {
    headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
};


const getMenus = async () => {
    suspense.value = true;
    try {
        let getListMenu = await axios.get(`${apibase}menu-sub-list`, config);
        listMenu.response = getListMenu.data.response;
        suspense.value = false;
    } catch (error) {
        console.log(error);
        router.push("/");
        suspense.value = true;
    }

}
onMounted(() => {
    getMenus();
});
</script>
