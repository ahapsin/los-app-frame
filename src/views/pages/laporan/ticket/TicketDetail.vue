<template>
    <!-- ===== Detail Ticket ===== -->
    <div class="flex gap-4 flex-col md:flex-row">
        <div class="w-full border p-4 rounded-xl bg-white h-fit">
            <n-descriptions label-placement="top" :column="3">
                <n-descriptions-item label="Ticket No">
                    <n-text type="primary">{{ dataDetail.ticket_no }}</n-text>
                </n-descriptions-item>
                <n-descriptions-item label="Status">
                    <n-tag :type="getTypeByStatus(dataDetail.status)" size="small" round>{{ dataDetail.status }}</n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Prioritas">
                    <n-tag :type="getTypeByPriority(dataDetail.priority)" size="small" round>{{ dataDetail.priority
                        }}</n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Kategori">
                    {{ dataDetail.category }}
                </n-descriptions-item>
                <n-descriptions-item label="PIC">

                    <n-tag round type="primary" v-if="dataDetail.assignee">
                        <template #icon>
                            <v-icon name="bi-person-circle"></v-icon>
                        </template>
                        {{ dataDetail.assignee }}
                    </n-tag>
                    <n-button size="small" dashed type="primary" v-if="me?.jabatan === 'HO'" @click="assignAction(dataDetail)">
                        <template #icon>
                            <v-icon name="bi-plus-lg"></v-icon>
                        </template>
                        tambah
                    </n-button>
                </n-descriptions-item>
                <n-descriptions-item label="Tanggal Dibuat">
                    {{ dataDetail.created_at }}
                </n-descriptions-item>
                <n-descriptions-item label="Dibuat oleh">
                    {{ dataDetail.created_by }}
                </n-descriptions-item>
                <n-descriptions-item label="Judul" :span="3">
                    <n-text strong>{{ dataDetail.title }}</n-text>
                </n-descriptions-item>
                <n-descriptions-item label="Deskripsi" :span="3">
                    {{ dataDetail.description }}
                </n-descriptions-item>
                <n-descriptions-item label="Lampiran" :span="3">
                    <n-space v-if="dataDetail.lampiran">
                        <n-image v-for="i in dataDetail.lampiran" :key="i" :src="i" class="w-16 h-16" />
                    </n-space>
                    <n-text v-else class="text-red-500">tidak ada lampiran</n-text>
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
                    <n-tag :type="getTypeByStatus(dataDetail.status)" size="small" round>{{ dataDetail.status }}</n-tag>
                    <n-tag :type="getTypeByPriority(dataDetail.priority)" size="small" round>{{ dataDetail.priority
                        }}</n-tag>
                    <n-text depth="3" strong>{{ dataDetail.ticket_no }}</n-text>
                </div>
            </div>
            <TicketLogs :id="dataDetail.key" :reload="reloadList" :isClosed="!dataDetail.is_closed" />
            <div v-if="dataDetail.status !== 'Closed'">
                <div class="flex gap-2 items-center justify-between bg-yellow-100 p-2" v-if="dataDetail.is_closed">
                    <div>Apakah masalah sudah selesai dan ticket dapat ditutup ?</div>
                    <div class="flex gap-2">
                        <n-button type="success" @click="handleClose" :loading="isLoading">Ya,Tutup</n-button>
                        <n-button type="info" tertiary @click="dataDetail.is_closed = false">Tidak</n-button>
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
    <n-modal v-model:show="assignModal" :mask-closable="false">
        <n-card title="Pilih PIC" class="w-fit" size="small" :segmented="true">
            <n-space vertical>
                <n-form-item label="petugas">
                    <n-select v-model:value="assignTo" placeholder="pilih petugas" :options="dataUser" value-field="id"
                        label-field="nama" filterable :render-tag="renderSingleSelectTag" :render-label="renderLabel" />
                </n-form-item>
            </n-space>
            <template #action>
                <n-space>
                    <n-button type="primary" @click="postAssign(assignBody.key)" :disabled="!assignTo">Oke</n-button>
                    <n-button type="error" @click="assignModal = false">Batal</n-button>
                </n-space>
            </template>
        </n-card>
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
import { useMeStore } from "../../../../stores/me";

const route = useRoute();
const ticketId = route.params.ticketid;
const { me } = useMeStore();
const formRef = ref(null);
const reply = ref(false);
const lampiranView = ref(false);
const reloadList = ref(false)
const handleNewPost = () => {
    reloadList.value = !reloadList.value
}
const message = useMessage();
const isLoading = ref(false);

const dataUser = ref([]);
const assignModal = ref(false);
const assignBody = ref();
const assignTo = ref(null);
const assignAction = (e) => {
    assignModal.value = true;
    getDataUser();
    assignBody.value = e;
}
const getDataUser = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "users",
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        dataUser.value = response.data.response;
    }
};

const postAssign = async (e) => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "PUT",
        api: `ticketing/${e}`,
        token: userToken,
        data: {
            assign_id: assignTo.value,
        }
    });
    if (!response.ok) {
        console.error(response.error);
    }
    else {
        assignModal.value = false;
        await getData();
    }
}


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

function getTypeByPriority(priority) {
    const map = {
        High: "error",
        Medium: "warning",
        Low: "success"
    };

    return map[priority] || "default";
}

function getTypeByStatus(status) {
    const map = {
        Open: "warning",
        Pending: "info"
    };

    return map[status] || "default";
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
