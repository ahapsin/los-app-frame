<template>
    <n-card title="Respon Ticket" size="small" bordered :segmented="true">
        <n-form ref="formRef" :model="form" :rules="rules" label-placement="top">
            <div class="grid md:grid-cols-2 gap-3">
                <!-- Deskripsi -->
                <n-form-item label="Deskripsi" path="description" class="md:col-span-2">
                    <n-input v-model:value="form.description" type="textarea" :rows="4"
                        placeholder="Jelaskan masalah atau permintaan" />
                </n-form-item>

                <!-- PIC -->
                <n-form-item label="Lampiran" path="lampiran" class="w-full">
                    <file-upload :def_preview="true" :multi="true" title="Upload Lampiran"
                        endpoint="image_upload_prospect" type="attch_kunjungan" :required="false"
                        @fallback="handleLampiranKunjungan" class="w-full" />
                </n-form-item>

            </div>

            <!-- Action -->
            <div class="flex justify-end gap-2 mt-4">
                <n-button secondary @click="resetForm">
                    Reset
                </n-button>
                <n-button type="primary" @click="handleSubmit">
                    Buat Ticket
                </n-button>
            </div>
        </n-form>
    </n-card>
</template>
<script setup>
import { ref } from "vue";

const formRef = ref(null);

const form = ref({
    ticket_no: "TCK-" + Math.floor(Math.random() * 900 + 100),
    title: "",
    category: null,
    priority: null,
    status: "Open",
    description: "",
    assignee: "",
});

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

const handleSubmit = () => {
    formRef.value?.validate((errors) => {
        if (!errors) {
            console.log("Submit:", form.value);
        }
    });
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