<template>
    <n-scrollbar style="max-height:400px" ref="scrollRef" class="relative">
        <div class="border-b" v-for="i in dataList" :key="i.Key">
            <div class="flex gap-2 items-top p-2">
                <div>
                    <n-avatar circle>
                        {{ (i.CreatedBy || 'System').charAt(0).toUpperCase() }}
                    </n-avatar>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <div class="flex items-center pt-1 gap-2">
                        <n-text strong>
                            {{ i.CreatedBy }}
                        </n-text>
                        <n-text>•</n-text>
                        <n-text depth="3" style="font-size: 12px">
                            {{ i.CreatedTime }}
                        </n-text>
                    </div>
                    <n-text>{{ i.Messages }}</n-text>

                    <div class="border p-2 rounded" v-if="i.Attach?.length > 0">
                        <n-image-group>
                            <div class="flex gap-2">
                                <n-image :key="i.Key" width="50" height="50" v-for="i in i.Attach" :src="i.PATH"
                                    class="w-10 h-10" />
                            </div>
                        </n-image-group>
                    </div>
                </div>
            </div>
        </div>
       
    </n-scrollbar>
</template>
<script setup>
import { useApi } from '../../../../helpers/axios';

const props = defineProps({
    id: String,
    reload: Boolean,
    isClosed: Boolean
})

const dataList = ref([]);
const isLoading = ref(false);
const getData = async () => {
    isLoading.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `ticketing_messages/${props?.id}`,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        isLoading.value = false;
        dataList.value = response.data;
    }
};
const scrollRef = ref(null)
const scrollToBottom = async () => {
    await nextTick()
    scrollRef.value?.scrollTo({
        top: 999999,
        behavior: 'auto' // atau 'smooth'
    })
}
watch(
    () => [props.id, props.reload, props.isClosed],
    ([id]) => {
        if (!id) return
        getData()
    },
    { immediate: true }
)

watch(
  () => dataList.value.length,
  () => {
    scrollToBottom()
  }
)
</script>