<template>
    <n-form>
        <n-form-item label="Nasabah">
            <n-radio-group v-model:value="dynamicForm.Status" name="radiogroup">
                <n-space>
                    <n-radio value="Baru">Baru</n-radio>
                    <n-radio value="Existing">Existing</n-radio>
                </n-space>
            </n-radio-group>
        </n-form-item>

        <n-form-item label="Nama Nasabah">
            <n-input v-if="dynamicForm.Status === 'Baru'" v-model:value="dynamicForm.Nama" placeholder="Nama Nasabah" />
            <n-select v-else v-model:value="dynamicForm.Nama" filterable placeholder="Cari Nasabah"
                :options="optionsRef" :loading="loadingRef" clearable remote @search="handleSearch"
                @update:value="handleSelectNasabah" />
        </n-form-item>
        <n-form-item label="Alamat">
            <n-input v-model:value="dynamicForm.Alamat" placeholder="Alamat Nasabah"
                :disabled="dynamicForm.Status === 'Existing'" clearable />
        </n-form-item>

        <n-form-item label="No Hp">
            <n-input v-model:value="dynamicForm.NoHandphone" placeholder="No Handphone"
                :disabled="dynamicForm.Status === 'Existing'" clearable />
        </n-form-item>
        <n-form-item label="Hasil Follow Up">
            <n-input v-model:value="dynamicForm.HasilFollowup" placeholder="Hasil Follow Up" />
        </n-form-item>
        <n-form-item label="Sumber Order">
            <n-input v-model:value="dynamicForm.SumberOrder" placeholder="Sumber Order" />
        </n-form-item>


        <n-form-item label="Keterangan">
            <n-input type="textarea" v-model:value="dynamicForm.Keterangan" placeholder="Keterangan" />
        </n-form-item>

        <n-form-item label="Dokumen Canvasing">
            <file-upload :def_preview="true" title="dokumen canvasing" endpoint="image_upload_prospect" type="canvasing"
                :idapp="dynamicForm.Id" :view-mode="false" :data_multi="dynamicForm.Dokumen" :multi="true" />
        </n-form-item>

        <n-space>
            <n-button type="primary" @click="handleSave">Simpan</n-button>
            <n-button type="error" @click="handleBatal">Batal</n-button>
        </n-space>

    </n-form>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { reactive, watch } from 'vue';
import { useApi } from '../../../../helpers/axios';

const dynamicForm = reactive({
    Id: uuid(),
    Status: "Baru",
    Nama: null,
    Alamat: null,
    NoHandphone: null,
    SumberOrder: null,
    Keterangan: null,
    Dokumen: []
})

const nasabahList = [
    {
        id: "NSB001",
        nama: "Budi Santoso",
        alamat: "Bandung",
        no_hp: "081234567890",
        status: "Baru"
    },
    {
        id: "NSB002",
        nama: "Siti Aminah",
        alamat: "Jakarta",
        no_hp: "081298765432",
        status: "Existing"
    },
    {
        id: "NSB003",
        nama: "Ahmad Fauzi",
        alamat: "Surabaya",
        no_hp: "082112223334",
        status: "Baru"
    },
    {
        id: "NSB004",
        nama: "Dewi Lestari",
        alamat: "Yogyakarta",
        no_hp: "081377788899",
        status: "Existing"
    }
]
watch(
    () => dynamicForm.Status,
    () => {
        dynamicForm.Nama = null
        dynamicForm.Alamat = null
        dynamicForm.NoHandphone = null
    }
)

const loadingRef = ref(false);
const optionsRef = ref([]);
const dataCustomer = ref([]);
const emit = defineEmits();

const handleSearch = async (query) => {
    if (!query) {
        optionsRef.value = []
        return
    }

    await getCustomer(query);
    const q = query.toLowerCase()

    optionsRef.value = dataCustomer.value
        .filter(item =>
            item.NAME?.toLowerCase().includes(q) ||
            item.ADDRESS?.toLowerCase().includes(q) ||
            item.PHONE?.includes(query)
        )
        .map(item => ({
            label: `${item.NAME} - ${item.PHONE_HOUSE} - ${item.ADDRESS}`,
            value: item.ID
        }))
}
const handleSelectNasabah = (val) => {
    console.log(val);
    const selected = dataCustomer.value.find(n => n.ID === val)
    if (selected) {
        dynamicForm.Nama = selected.NAME
        dynamicForm.Alamat = selected.ADDRESS
        dynamicForm.NoHandphone = selected.PHONE_HOUSE
    }
}
const handleSave = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "POST",
        data: dynamicForm,
        api: "canvasing",
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
    } else {
        emit('canceled', true);
        // dataList.value = response.data;
    }

}
const getCustomer = async (e) => {
    loadingRef.value = true;
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: `customers?search=${e}`,
        token: userToken,
    });
    if (!response.ok) {
        console.error(response.error);
        loadingRef.value = false;
    } else {
        loadingRef.value = false;
        dataCustomer.value = response.data;
    }
}
const handleBatal = () => {
    emit('canceled', true);
}
</script>
