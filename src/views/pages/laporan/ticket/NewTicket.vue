<template>
    <n-card title="Buat Ticket" size="small" bordered :segmented="true">
        <template #header-extra>
            <n-button circle quaternary type="error" size="small" @click="handleClose">
                <template #icon>
                    <v-icon name="bi-x" />
                </template>
            </n-button>
        </template>
        <n-form ref="formRef" :model="form" :rules="rules" label-placement="top">
            <div class="grid md:grid-cols-2 gap-3">

                <!-- Prioritas -->
                <n-form-item label="Prioritas" path="priority">
                    <n-select v-model:value="form.priority" :options="priorityOptions" placeholder="Pilih prioritas" />
                </n-form-item>
                <!-- Kategori -->
                <n-form-item label="Kategori" path="category">
                    <n-select v-model:value="form.category" :options="categoryOptions" placeholder="Pilih kategori" />
                </n-form-item>

                <!-- Judul -->
                <n-form-item label="Judul Tiket" path="title" class="md:col-span-2">
                    <n-input v-model:value="form.title" placeholder="Masukkan judul ticket" />
                </n-form-item>

                <!-- Deskripsi -->
                <n-form-item label="Deskripsi" path="description" class="md:col-span-2">
                    <n-input v-model:value="form.description" type="textarea" :rows="4"
                        placeholder="Jelaskan masalah atau permintaan" />
                </n-form-item>

                <!-- PIC -->
                <n-form-item label="Lampiran" path="lampiran" class="w-full">
                    <file-upload :def_preview="true" :multi="true" title="Upload Lampiran" endpoint="uploads"
                        type="lampiran_tiket" :required="false" @fallback="handleLampiran" class="w-full"
                        path="tiket" />
                </n-form-item>
            </div>
        </n-form>
        <template #action>
            <div class="flex gap-2 ">

                <n-button type="primary" @click="handleSubmit">
                    Buat Ticket
                </n-button>
                <n-button secondary @click="resetForm">
                    Reset
                </n-button>
            </div>
        </template>
    </n-card>
</template>
<script setup>
import { useTickets } from '../../../../composables/useTickets';
import { ref } from "vue";

const formRef = ref(null);

const { postTicket } = useTickets();

const form = ref({
    title: "",
    category: null,
    priority: null,
    status: "Pending",
    description: "",
    assignee: "",
    lampiran: []
});

const handleLampiran = (e) => {
    form.value?.lampiran.push(e);
}
const handleClose = () => {
    emit('closed', true)
}
const AssignTicket = ref({
    ticket_no: "TCK-",
    pic: "pic ticket",
})

const rules = {
    title: {
        required: true,
        message: "Judul wajib diisi",
        trigger: "blur",
    },
    category: {
        required: true,
        message: "Kategori wajib dipilih",
        trigger: "change",
    },
    priority: {
        required: true,
        message: "Prioritas wajib dipilih",
        trigger: "change",
    },
};

const priorityOptions = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
];

const categoryOptions = [
    { label: "Bug", value: "Bug" },
    { label: "Support", value: "Support" },
    { label: "Feature Request", value: "Feature Request" },
    { label: "Performance", value: "Performance" },
];

const statusOptions = [
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Pending", value: "Pending" },
    { label: "Resolved", value: "Resolved" },
];
const emit = defineEmits();
const handleSubmit = async () => {
    try {
        await formRef.value?.validate();
        await postTicket(form.value);
        emit('posted', true);
    } catch (errors) {
        console.log(errors);
    }
};

const resetForm = () => {
    formRef.value?.restoreValidation();
    form.value.title = "";
    form.value.category = null;
    form.value.priority = null;
    form.value.description = "";
    form.value.assignee = "";
};
</script>