<template>
    <div class="flex gap-4 w-full">
        <div class="w-full">
            <n-space vertical>
                <n-card :title="`Update Rekening`" :segmented="true" size="small">
                    <template #header-extra>
                        <n-space class="!gap-1">
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
                            <div class="hidden md:flex gap-2">
                                <n-dropdown :options="optAction">
                                    <n-button circle quaternary>
                                        <v-icon name="bi-three-dots-vertical" />
                                    </n-button>
                                </n-dropdown>
                            </div>
                            <div class=" md:hidden">
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
                    <n-space vertical :size="12" class="pt-4">
                        <n-data-table size="small" :columns="columns" :data="showData" :pagination="pagination"
                            :loading="isLoading" />
                    </n-space>
                </n-card>
            </n-space>
        </div>
        <div v-if="group" class="w-1/3">
            <n-card size="small" title="Group Menu">
                <template #header-extra>
                    <n-space>
                        <n-button type="primary">
                            <template #icon>
                                <v-icon name="bi-plus-circle"></v-icon>
                            </template>
                            Group</n-button>
                        <n-button circle secondary @click="group = !group">
                            <template #icon>
                                <v-icon name="bi-x"></v-icon>
                            </template>
                        </n-button>
                    </n-space>
                </template>
                group menu
            </n-card>
        </div>
    </div>
</template>