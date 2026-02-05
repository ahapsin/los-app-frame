<template>
    <!-- ===== Detail Ticket ===== -->
    <div class="flex gap-4 flex-col md:flex-row">
        <div class="w-full border p-4 rounded-xl bg-white h-fit">
            <n-descriptions label-placement="top" :column="2">
                <n-descriptions-item label="Ticket No">
                    <n-text type="primary">{{ dataDetail.ticket_no }}</n-text>
                </n-descriptions-item>
                <n-descriptions-item label="Status">
                    <n-tag type="error" size="small">{{ dataDetail.status }}</n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Prioritas">
                    <n-tag type="error" size="small">{{ dataDetail.priority }}</n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Kategori">
                    {{ dataDetail.category }}
                </n-descriptions-item>
                <n-descriptions-item label="PIC">
                    {{ dataDetail.assignee }}
                </n-descriptions-item>
                <n-descriptions-item label="Tanggal Dibuat">
                    {{ dataDetail.created_at }}
                </n-descriptions-item>
                <n-descriptions-item label="Judul" :span="2">
                    {{ dataDetail.title }}
                </n-descriptions-item>
                <n-descriptions-item label="Deskripsi" :span="2">
                    {{ dataDetail.description }}
                </n-descriptions-item>
                <n-descriptions-item label="Lampiran" :span="2">
                    <n-space>
                        <n-image v-for="i in dataDetail.lampiran" :key="i" :src="i" class="w-16 h-16" />
                    </n-space>
                </n-descriptions-item>
            </n-descriptions>
            <!-- ===== Response ===== -->
            <!-- <n-divider title-placement="left">Diskusi</n-divider> -->
            <!-- List Response -->
            <!-- <div class="space-y-3 border p-2 bg-yellow-50 border-yellow-300">
                    <div class="flex gap-2 items-top">
                        <div>
                            <n-avatar src="" circle>A</n-avatar>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="pt-1">
                                <n-text strong>
                                    Admin IT
                                </n-text>
                                <n-text>•</n-text>
                                <n-text depth="3" style="font-size: 12px">
                                    2026-01-05 10:00
                                </n-text>
                            </div>
                            <n-text>Masalah sudah kami temukan, akan diperbaiki.</n-text>
                            <n-image
                                src="https://rogcommunity.id/wp-content/uploads/2023/09/screenshot-di-pc-windows-1024x576.jpg" />
                        </div>
                    </div>
                </div> -->
        </div>
        <div class="border w-full rounded-lg overflow-clip h-fit bg-white p-2">
            <div class=" flex justify-between p-2 border-b">
                <n-text strong>
                    {{ dataDetail.title }}
                </n-text>
                <div class="flex gap-2 items-center">
                    <n-tag size="small" type="success">{{ dataDetail.priority }}</n-tag>
                    <n-tag size="small" type="success">{{ dataDetail.status }}</n-tag>
                    <n-text depth="3" strong>{{ dataDetail.ticket_no }}</n-text>
                </div>
            </div>
            <TicketLogs :id="dataDetail.key" :reload="reloadList" :isClosed="!dataDetail.is_closed" />
            <div v-if="dataDetail.status !== 'Closed'">
                <div class="flex gap-2 items-center justify-between bg-yellow-100 p-2" v-if="dataDetail.is_closed">
                    <div>Apakah masalah sudah selesai dan ticket dapat ditutup ?</div>
                    <div class="flex gap-2">
                        <n-button type="success" @click="handleClose" :loading="isLoading">Ya,Tutup</n-button>
                        <n-button type="info" tertiary @click="dataDetail.is_closed =false">Tidak</n-button>
                    </div>
                </div>
                <PostReply :id="dataDetail.key" @newpost="handleNewPost" />
            </div>
        </div>
    </div>
    <n-modal v-model:show="reply">
        <div>
            <ReplyTicket />
        </div>
    </n-modal>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ReplyTicket from "./ReplyTicket.vue";
import { useApi } from "../../../../helpers/axios";
import TicketLogs from "./TicketLogs.vue";
import PostReply from "./PostReply.vue";
import { useMessage } from "naive-ui";

const route = useRoute();
const ticketId = route.params.ticketid;

const formRef = ref(null);
const reply = ref(false);
const lampiranView = ref(false);
const reloadList = ref(false)
const handleNewPost = () => {
    reloadList.value = !reloadList.value
}
const message = useMessage();
const isLoading = ref(false);


const priorityMap = {
    low: {
        type: 'success',
        label: 'Low'
    },
    medium: {
        type: 'warning',
        label: 'Medium'
    },
    high: {
        type: 'error',
        label: 'High'
    }
}
const responses = ref([
    {
        id: 1,
        user: "Admin IT",
        message: "Kami sedang melakukan pengecekan.",
        date: "2026-01-05 10:00",
    },
    {
        id: 2,
        user: "Andi",
        message: "Masalah sudah kami temukan, akan diperbaiki.",
        date: "2026-01-05 11:30",
        attachment:
            "https://i.extremetech.com/imagery/content-types/03q23d2PuedyKJD1UwrehFl/hero-image.fit_lim.v1678673307.jpg",
    },
]);

const replyForm = ref({
    message: "",
});

const submitReply = () => {
    if (!replyForm.value.message) return;

    responses.value.push({
        id: Date.now(),
        user: "User",
        message: replyForm.value.message,
        date: new Date().toLocaleString(),
    });

    replyForm.value.message = "";
};
const dataDetail = ref([]);

const getData = async () => {
    const param = route.params?.ticketid;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `ticketing/${param}`,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        dataDetail.value = response.data;
    }
};

const handleClose = async () => {

    isLoading.value = true
    const userToken = localStorage.getItem('token')

    const response = await useApi({
        method: 'POST',
        api: 'ticketing_closed',
        token: userToken,
        data: {
            TicketId: dataDetail.value.key,
            IsClosed: true
        }
    })

    isLoading.value = false

    if (!response.ok) {
        message.info('success di tutup')
        return
    }
    getData();

}
onMounted(() => getData());
</script>
