<template>
    <div class="pt-4">
        <n-space vertical>
            <n-card :title="`Tabel ${$route.name}`">
                <template #header-extra>
                    <n-space>
                        <n-popover trigger="click" placement="bottom-end">
                            <template #trigger>
                                <n-button>
                                    <n-icon>
                                        <search-icon />
                                    </n-icon>
                                </n-button>
                            </template>
                            <n-input autofocus="true" clearable placeholder="cari disini.." />
                        </n-popover>
                        <n-button>
                            <template #icon>
                                <n-icon>
                                    <download-icon />
                                </n-icon>
                            </template>
                            download
                        </n-button>
                        <n-button type="primary" @click="handleAdd">
                            <template #icon>
                                <n-icon>
                                    <add-icon />
                                </n-icon>
                            </template>
                            tambah
                        </n-button>
                    </n-space>
                </template>
                <n-space vertical :size="12" class="pt-4">
                    <n-data-table size="small" :columns="columns" :data="dataTable" :pagination="pagination" />
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import { useApi } from "../../../helpers/axios";
import router from '../../../router';
import { useDialog, useMessage, NDropdown, NIcon, NTag, NButton } from "naive-ui";
import {
    AddCircleOutlineRound as AddIcon,
    SearchOutlined as SearchIcon,
    FileDownloadOutlined as DownloadIcon,

} from "@vicons/material"
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    ListAltOutlined as DetailIcon
} from "@vicons/material";


const message = useMessage();
const dialog = useDialog();
const dataTable = ref();

const columns = [
    {
        title: "Cabang",
        key: "cabang_nama"
    },
    {
        title: "NIK",
        key: "nik"
    },
    {
        title: "Nama",
        key: "nama"
    },
    {
        title: "No Handphone",
        key: "hp"
    },
    {
        title: "Email",
        key: "email"
    }, {
        title: "",
        align: "right",
        key: "more",
        render(row) {
            return h(
                NDropdown,
                {
                    options: options,
                    size: "small",
                    onSelect: (e) => {
                        if (e === "hapus") {
                            handleConfirm(row);
                        }
                        if (e === "detail") {
                            handleDetail(row);
                        }
                        if (e === "edit") {
                            handleUpdate(row);
                        }
                    },
                },
                {
                    default: h(NButton, {
                        size: "small",
                    }, { default: () => 'Action' })
                }
            );
        }
    }];

const statusTag = (e) => {
    if (e === "Active") {
        return "success";
    } else if (e === "Non-Active") {
        return "warning";
    }

}
const handleConfirm = (evt) => {
    dialog.warning({
        title: "Confirm",
        content: "Apakah anda yakin ingin menghapus data ?",
        positiveText: "Ya",
        negativeText: "Batal",
        onPositiveClick: async () => {
            let userToken = localStorage.getItem("token");
            const response = await useApi({
                method: 'DELETE',
                api: `karyawan/${evt.id}`,
                token: userToken
            });
            if (!response.ok) {
                message.error("api transaction error");
            } else {
                dataTable.value.splice(evt, 1);
                message.success("Data berhasil dihapus");
            }

        },
        onNegativeClick: () => {
            message.error("Batal hapus data !");
        }
    });
}
const handleDetail = (evt) => {
    router.push(`/master/employee-action/${evt.employee_id}/detail`);
}
const handleUpdate = (evt) => {
    router.push(`/master/employee-action/${evt.employee_id}`);
}
const handleAdd = () => {
    router.push('/master/employee-action');
}
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: 'GET',
        api: 'karyawan',
        token: userToken
    });
    if (!response.ok) {
      console.log(reponse.error);
    } else {
        dataTable.value = response.data.response;
    }
}
const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        });
    };
};
const options = [
    {
        label: "Hapus",
        key: "hapus",
        icon: renderIcon(DeleteIcon)
    },
    {
        label: "Detail",
        key: "detail",
        icon: renderIcon(DetailIcon)
    }
];
const pagination = {
    pageSize: 10
}

onMounted(() => getData());
</script>