<template>
    <n-space vertical>
        <n-card :segmented="{
            content: true,
            footer: 'soft'
        }" :title="`Tabel ${$route.name}`">
            <template #header-extra>
                <n-space class="!gap-1">
                    <div class="me-1">
                        <n-popover trigger="click" placement="bottom-end">
                            <template #trigger>
                                <n-button circle>
                                    <n-icon>
                                        <search-icon />
                                    </n-icon>
                                </n-button>
                            </template>
                            <n-input autofocus="true" clearable placeholder="cari disini.." v-model:value="searchBox" />
                        </n-popover>
                    </div>
                    <!-- <div class="hidden md:flex">
                            <n-button>
                                <template #icon>
                                    <n-icon>
                                        <download-icon />
                                    </n-icon>
                                </template>
                                <strong class="hidden md:!block">download</strong>
                            </n-button>
                        </div> -->
                    <div class="md:hidden">
                        <n-button>
                            <template #icon>
                                <n-icon>
                                    <download-icon />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                    <div class="hidden md:flex">
                        <n-button type="primary" @click="handleAdd">
                            <template #icon>
                                <n-icon>
                                    <add-icon />
                                </n-icon>
                            </template>
                            <strong>tambah</strong>
                        </n-button>
                    </div>
                    <div class="md:hidden">
                        <n-button type="primary" @click="handleAdd">
                            <template #icon>
                                <n-icon>
                                    <add-icon />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </n-space>
            </template>
            <n-space vertical>
                <n-data-table size="small" striped :scroll-x="500" :columns="columns" :data="showData"
                    :pagination="pagination" />
            </n-space>
        </n-card>
        <n-modal v-model:show="showModal" preset="dialog" title="Dialog" content="Are you sure?" positive-text="Submit"
            negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback" />
    </n-space>
</template>
<script setup>
import { ref, onMounted, h } from "vue";
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import router from "../../../router";
import {
    useDialog,
    useMessage,
    NDropdown,
    NIcon,
    NTag,
    NButton,
    NEllipsis,
} from "naive-ui";
import {
    SettingsRound as SettingIcon,
    AddCircleOutlineRound as AddIcon,
    SearchOutlined as SearchIcon,
    FileDownloadOutlined as DownloadIcon,
} from "@vicons/material";
import { ListAltOutlined as DetailIcon } from "@vicons/material";

const searchBox = ref();
const message = useMessage();
const dialog = useDialog();
const dataTable = ref([]);
const showModal = ref(false);
const columns = [
    {
        title: "Username",
        key: "username",
        sorter: "default",
    },
    {
        title: "Nama",
        key: "nama",
        sorter: "default",
    },
    {
        title: "Cabang",
        key: "cabang_nama",
        sorter: "default",
        render(row) {
            return h(
                NEllipsis,
                {
                    style: "max-width:150px",
                },
                { default: () => row.cabang_nama }
            );
        },
    },
    {
        title: "Hp",
        sorter: "default",
        key: "no_hp",
    },
    {
        title: "status",
        sorter: "default",
        key: "status",
        render(row) {
            return h(
                NTag,
                {
                    type: statusTag(row.status),
                },
                {
                    default: () => row.status,
                }
            );
        },
    },
    {
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
                        // if (e === "hapus") {
                        //     handleConfirm(row);
                        // }
                        if (e === "detail") {
                            handleDetail(row);
                        }
                        if (e === "reset") {
                            handleReset(row);
                        }
                        if (e === "settingMenu") {
                            handleSettingMenu(row);
                        }
                    },
                },
                {
                    default: () =>
                        h(
                            NButton,
                            {
                                size: "small",
                            },
                            { default: () => "Action" }
                        ),
                }
            );
        },
    },
];

const statusTag = (e) => {
    if (e === "Active") {
        return "success";
    } else if (e === "InActive") {
        return "warning";
    }
};
const handleConfirm = (row, index) => {
    dialog.warning({
        title: "Confirm",
        content: "Apakah anda yakin ingin menghapus data ?",
        positiveText: "Ya",
        negativeText: "Batal",
        onPositiveClick: async () => {
            let userToken = localStorage.getItem("token");
            const response = await useApi({
                method: "DELETE",
                api: `cabang/${row.id}`,
                token: userToken,
            });
            if (!response.ok) {
                message.error("api transaction error");
            } else {
                dataTable.value.splice(index, 1);
                message.success("Data berhasil dihapus");
            }
        },
        onNegativeClick: () => {
            message.error("Batal hapus data !");
        },
    });
};
const handleDetail = (evt) => {
    router.push(`/master/users-action/${evt.id}/detail`);
};
const handleAdd = () => {
    router.push("/master/users-action");
};

const handleReset = (e) => {
    dialog.warning({
        title: "Confirm",
        content: `Apakah anda yakin ingin mereset password user ${e.username} ?`,
        positiveText: "Ya",
        negativeText: "Batal",
        onPositiveClick: async () => {
            message.loading(`mereset password ${e.username} !`);
            let userToken = localStorage.getItem("token");
            const body = {
                username: e.username,
                password: e.username,
                new_password: e.username
            }
            const response = await useApi({
                method: "POST",
                api: `reset_password`,
                data: body,
                token: userToken,
            });
            if (!response.ok) {
                message.error("api transaction error");
            } else {

                message.success(`password user ${e.username} direset ke default !`);
            }
        },
        onNegativeClick: () => {
            message.error("Batal reset password !");
        },
    });
}

const handleSettingMenu = (e) => {
    router.push(`/master/users-menu/${e.id}`);
};
const loadingBar = useLoadingBar();
const getData = async () => {
    let userToken = localStorage.getItem("token");
    const response = await useApi({
        method: "GET",
        api: "users",
        token: userToken,
    });
    if (!response.ok) {
      console.log(reponse.error);
    } else {
        loadingBar.finish();
        // console.log(response.data.response)
        dataTable.value = response.data.response;
    }
};
const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        });
    };
};
const options = [
    {
        label: "Atur Menu",
        key: "settingMenu",
        icon: renderIcon(SettingIcon),
    },
    {
        label: "Reset Password",
        key: "reset",
        icon: renderIcon(SettingIcon)
    },
    {
        label: "Detail",
        key: "detail",
        icon: renderIcon(DetailIcon),
    },
];
const pagination = {
    pageSize: 10,
};

onMounted(() => getData());
const showData = computed(() => {
    return useSearch(dataTable.value, searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>
