<template>
        <div class="p-4">
                <DisclosMenu :menus="listMenu.response">
                </DisclosMenu>
                <!-- <pre>{{ listMenu.response }}</pre> -->
        </div>
        <div v-if="suspense">
                <DisclosMenuSusp />
        </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import DisclosMenu from "../molecules/DisclosMenu.vue";
import DisclosMenuSusp from "../molecules/DisclosMenuSusp.vue";
import router from "../../router/index.js"

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