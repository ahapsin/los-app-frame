<template>
    <div>
        <n-card title="Tiket Bantuan" size="small" :segmented="true">
            <template #header-extra>
                <n-space>
                    <n-input autofocus="true" clearable placeholder="cari disini.." v-model:value="searchBox">
                        <template #prefix>
                            <v-icon name="bi-search" />
                        </template>
                    </n-input>
                    <n-button type="primary" @click="createTicket = true">
                        <template #icon>
                            <v-icon name="bi-plus-circle" />
                        </template>
                        Buat Ticket
                    </n-button>
                </n-space>
            </template>
            <n-data-table :columns="ticketColumns" :data="showData" size="small" :pagination="10" />
        </n-card>
    </div>
    <n-modal v-model:show="createTicket" :mask-closable="false">
        <div class="w-1/2">
            <NewTicket @posted="handlePosted" @closed="handleClose" />
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
import { useRouter } from 'vue-router';
import NewTicket from './NewTicket.vue';
import { NAvatar, NButton, NIcon, NTag, NText, useMessage } from 'naive-ui';
import { useSearch } from '../../../../helpers/searchObject';
import { AccountCircleOutlined, PlusRound } from "@vicons/material";
import { useTickets } from '../../../../composables/useTickets';
import { useApi } from '../../../../helpers/axios';
import { useMeStore } from '../../../../stores/me';

const router = useRouter();
const createTicket = ref(false);
const searchBox = ref();
const message = useMessage();
const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        });
    };
};
const assignTo = ref(null);
const dataUser = ref([]);
const getData = async () => {
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
const { me } = useMeStore();
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
        await fetchTickets();
    }
}

const handlePosted = async () => {
    createTicket.value = false;
    message.success('Tiket berhasil dibuat');
    try {
        await fetchTickets();
    } catch (err) {
        message.error('Gagal memuat ulang tiket');
    }
};

const handleClose = (e) => {
    createTicket.value = !e;
}
const renderLabel = (option) => {
    return h(
        "div",
        {
            style: {
                display: "flex",
                alignItems: "center"
            }
        },
        [
            h(NAvatar, {
                round: true,
                size: "small"
            }, {
                default: () => option.nama.charAt(0)
            }),
            h(
                "div",
                {
                    style: {
                        marginLeft: "12px",
                        padding: "4px 0"
                    }
                },
                [
                    h("div", null, [option.nama]),
                    h(
                        NText,
                        { depth: 3, tag: "div" },
                        {
                            default: () => option.username
                        }
                    )
                ]
            )
        ]
    );
};
const renderSingleSelectTag = ({ option }) => {
    return h(
        "div",
        {
            style: {
                display: "flex",
                alignItems: "center"
            }
        },
        [
            h(NAvatar, {
                round: true,
                size: 24,
                style: {
                    marginRight: "12px"
                }
            }, {
                default: () => option.nama.charAt(0)
            }),
            option.nama
        ]
    );
};
const ticketColumns = [
    {
        title: "No Tiket",
        sorter: "default",
        key: "ticket_no",
        render(row) {
            return h(
                NText,
                {
                    type: "primary",
                    style: {
                        cursor: "pointer",
                        textDecoration: "underline",
                    },
                    onClick: () => {
                        router.push({
                            name: 'ticket_detail',
                            params: {
                                ticketid: row.key
                            }
                        })
                    },
                },
                { default: () => row.ticket_no }
            );
        },
    },
    { title: "Judul", key: "title", sorter: "default", },
    { title: "Kategori", key: "category", sorter: "default", },
    {
        title: "Prioritas",
        key: "priority",
        sorter: "default",
        render(row) {
            let type = "default";

            switch (row.priority) {
                case "High":
                    type = "error";
                    break;
                case "Medium":
                    type = "warning";
                    break;
                case "Low":
                    type = "success";
                    break;
            }

            return h(
                NTag,
                {
                    type,
                    size: "small",
                    round: true,
                },
                { default: () => row.priority }
            );
        },
    },
    {
        title: "Status",
        key: "status",
        sorter: "default",
        render(row) {
            let type = "default";

            switch (row.status) {
                case "Open":
                    type = "warning";
                    break;
                case "Pending":
                    type = "info";
                    break;
            }

            return h(
                NTag,
                {
                    type,
                    size: "small",
                    round: true,
                },
                { default: () => row.status }
            );
        },
    },
    {
        title: "PIC",
        sorter: "default",
        key: "assignee",
        render(row) {
            if (me?.jabatan === 'HO') {
                if (row.assignee)
                    return h(NTag, {
                        round: true,
                        type: "success",
                        onClose: () => message.success('berhasil hapus')
                    }, {
                        icon: renderIcon(AccountCircleOutlined),
                        default: () => row.assignee
                    })

                return h(NButton, {
                    size: "small",
                    dashed: true,
                    onclick: () => assignAction(row)
                }, {
                    icon: renderIcon(PlusRound),
                    default: () => "tambah"
                })
            }
            else {
                if (row.assignee) {
                    return h(NTag, {
                        round: true,
                        type: "success",
                    }, {
                        icon: renderIcon(AccountCircleOutlined),
                        default: () => row.assignee
                    })
                }
            }
        }
    },
    { title: "Dibuat", sorter: "default", key: "created_at" },
];

const assignModal = ref(false);
const assignBody = ref();
const assignAction = (e) => {
    assignModal.value = true;
    getData();
    assignBody.value = e;
}


const { tickets, fetchTickets } = useTickets();

onMounted(() => {
    fetchTickets()
})

const showData = computed(() => {
    return useSearch(tickets.value, searchBox.value);
    // return filterIt(dataTable.value, searchBox.value);
});
</script>