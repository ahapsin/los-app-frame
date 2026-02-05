<template>
    <div class="p-2">
        <n-input type="textarea" show-count v-model:value="bodyReply.Messages" :autosize="{ minRows: 3, maxRows: 5 }" />

        <div class="py-2 flex justify-between  items-center">
            <div class="flex gap-2">
                <n-button type="primary" :disabled="!bodyReply.Messages || isLoading" :loading="isLoading"
                    @click="postReply">
                    Submit
                </n-button>
                <n-badge :value="bodyReply.Attach.length || 0">
                    <n-button circle @click="fileModal = true">
                        <v-icon name="bi-card-image" />
                    </n-button>
                </n-badge>
                <n-badge :value="bodyReply.Attach.length || 0">
                    <n-button circle @click="fileModal = true" disabled>
                        <v-icon name="bi-paperclip" />
                    </n-button>
                </n-badge>
                <!-- Emoji Picker -->
                <n-popover trigger="click" placement="top" v-model:show="showEmoji">
                    <template #trigger>
                        <n-button circle>
                            <v-icon name="bi-emoji-smile" />
                        </n-button>
                    </template>
                    <div class="grid grid-cols-6 gap-2 p-1">
                        <n-button v-for="e in emojis" :key="e" quaternary circle size="large" @click="insertEmoji(e)">
                            {{ e }}
                        </n-button>
                    </div>
                </n-popover>
            </div>
            <div>
                <n-checkbox v-model:checked="bodyReply.IsClosed">
                    ajukan close
                </n-checkbox>
            </div>
        </div>

        <!-- Upload Modal -->
        <n-modal v-model:show="fileModal">
            <n-card class="w-1/2">
                <file-upload class="w-full" title="Upload Lampiran" endpoint="uploads" type="lampiran_tiket"
                    path="tiket_reply" :multi="true" :required="false" :def_preview="false"
                    :data_multi="bodyReply.Attach" @fallback="handleFallback" />
            </n-card>
        </n-modal>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import FileUpload from '../../../../components/atoms/FileUpload.vue'
import { useApi } from '../../../../helpers/axios'

const props = defineProps({
    id: String
})

const emit = defineEmits(['newpost'])

const isLoading = ref(false)
const fileModal = ref(false)
const showEmoji = ref(false)

const bodyReply = reactive({
    Messages: null,
    Attach: [],
    IsClosed: false
})

const emojis = ['😀', '😁', '😂', '🤣', '😊', '😍', '👍', '🙏', '🔥', '🎉', '😢', '😡']

const insertEmoji = (emoji) => {
    bodyReply.Messages = (bodyReply.Messages || '') + emoji
    showEmoji.value = false
}

const handleFallback = (path) => {
    bodyReply.Attach.push({
        ID: uuidv4(), // UUID per file
        PATH: path
    })
}

const postReply = async () => {
    if (!props.id || !bodyReply.Messages) return

    isLoading.value = true
    const userToken = localStorage.getItem('token')

    const response = await useApi({
        method: 'POST',
        api: 'ticketing_messages',
        token: userToken,
        data: {
            TicketId: props.id,
            Messages: bodyReply.Messages,
            Attach: bodyReply.Attach,
            IsClosed: bodyReply.IsClosed
        }
    })

    isLoading.value = false

    if (!response.ok) {
        console.error(response.error)
        return
    }

    // reset form
    bodyReply.Messages = null
    bodyReply.Attach = []
    fileModal.value = false

    emit('newpost')
}
</script>
