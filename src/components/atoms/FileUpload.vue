<template>
  <div>
    <canvas ref="canvas" style="display: none"></canvas>
    <div class="flex flex-col w-full gap-4">
      <div class="border rounded-xl py-2 pl-2 pr-2 flex flex-col  w-full gap-2 bg-white hover:shadow"
        :class="errorCapture ? 'border-red-200 bg-red-50' : 'border'">
        <div class="flex gap-2 items-center">
          <div v-show="!props.def_preview" class="flex gap-2">
            <div v-if="state.resizedImage">
              <n-image :src="state.resizedImage" class="h-20 w-20 min-w-20 rounded-xl" />
            </div>
            <div v-else-if="props.def_value">
              <n-image :src="props.def_value" class="h-20 w-20 min-w-20 rounded-xl" object-fit="fit" />
            </div>
            <div v-else>
              <n-image src="https://www.shorekids.co.nz/wp-content/uploads/2014/08/image-placeholder.jpg"
                class="h-20 w-20 min-w-20 rounded-xl border-red-500" />
            </div>
          </div>
          <n-upload accept="image/png, image/jpeg,image/jpg" @change="beforeUpload" :show-file-list="false" multiple
            :show-remove-button="true" :show-retry-button="true" v-show="!props.viewMode" @remove="handleRemove">
            <div class="flex flex-col">
              <n-button :type="errorCapture ? 'error' : 'primary'" dashed>
                <div class="flex gap-2">
                  <n-icon> <upload-icon /> </n-icon>
                  {{ props.title }}
                </div>
              </n-button>
            </div>
            <div class="pt-2" v-if="props.required && !required">
              <n-tag size="small" type="info" round>
                <template #icon>
                  <v-icon name="bi-info-circle-fill" />
                </template>
                harus diisi</n-tag>
            </div>
          </n-upload>
          <div class="flex flex-col" v-show="props.viewMode">
            <n-button tertiary :type="errorCapture ? 'error' : 'success'">
              <div class="flex gap-2">
                {{ props.title }}
              </div>
            </n-button>
          </div>
        </div>
        <div v-if="dataPreview?.length > 0">
          <div v-if="props.multi && props.data_multi" class="flex gap-4 p-4 bg-slate-100 rounded-lg">
            <div v-for="prev_multi in dataPreview" :key="prev_multi" class="relative group">
              <n-popconfirm @positive-click="removePreview(prev_multi.url)" positive-text="ya" negative-text="tidak"
                v-if="!props.viewMode">
                <template #trigger>
                  <n-button class="absolute -right-4 -top-4  ring-2 ring-white" size="small" circle type="error">
                    <v-icon name="bi-x-lg" />
                  </n-button>
                </template>
                hapus dokumen ?
              </n-popconfirm>
              <n-image :src="prev_multi.url" object-fit="cover" :width="50" :height="50"
                class="ring-2 ring-white shadow rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { lyla } from "@lylajs/web";
import { CloudUploadFilled as UploadIcon } from "@vicons/material";
import _ from "lodash";
import { useMessage } from "naive-ui";
import { computed, defineEmits, reactive, ref, toRef } from "vue";

const message = useMessage();
const userToken = localStorage.getItem("token");

const canvas = ref(null); // Reference to the canvas element

// State object to hold properties
const state = reactive({
  maxWidth: 1280, // Maximum width of the resized image
  maxHeight: 720, // Maximum height of the resized image
  resizedImage: null,
  image: computed(() => state.resizedImage), // The resized image data
  quality: 0.9, // JPEG quality
});
const downscaleImage = (ctx, img, width, height) => {
  ctx.drawImage(img, 0, 0, width, height);
  // Additional logic for downscaling in steps can be added here.
};
const resizeImage = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;

      let newWidth = img.width;
      let newHeight = img.height;

      // Maintain aspect ratio and resize if necessary
      if (newWidth > state.maxWidth || newHeight > state.maxHeight) {
        if (newWidth > newHeight) {
          newWidth = state.maxWidth;
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = state.maxHeight;
          newWidth = newHeight * aspectRatio;
        }
      }

      const ctx = canvas.value.getContext("2d");

      // Set canvas dimensions based on new size
      canvas.value.width = newWidth;
      canvas.value.height = newHeight;

      // Optional: downscale the image in steps to improve quality
      downscaleImage(ctx, img, newWidth, newHeight);

      // Get the resized image data as a base64 URL (set quality for JPEG)
      state.resizedImage = canvas.value.toDataURL("image/jpeg", state.quality);
      // console.log(state.resizedImage);
      handleImagePost(state.resizedImage);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};
const beforeUpload = (data) => {
  resizeImage(data.file.file);
};
const emit = defineEmits();
const errorCapture = ref(false);
const required = ref(false);
const handleImagePost = () => {
  const bodyForm = {
    image: state.resizedImage,
    type: props.type,
    reff: props.reff,
    cr_prospect_id: props.idapp,
    uid: props.idapp,
  };
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  lyla
    .post(`${import.meta.env.VITE_APP_API_BASE}${props.endpoint}`, {
      headers,
      json: bodyForm,
    })
    .then((json) => {
      emit('fallback', { type: props.type, url: json.json.response });
      message.success(`upload ${props.title} berhasil`);
      required.value = true;
    })
    .catch(() => {
      message.error(`upload ${props.title}  gagal`);
      errorCapture.value = true;
    });
};

const props = defineProps({
  title: String,
  endpoint: String,
  type: String,
  reff: String,
  idapp: String,
  fid: String,
  def_value: String,
  def_preview: Boolean,
  multi: Boolean,
  required: Boolean,
  data_multi: Object,
  viewMode: {
    type: Boolean,
    default: false,
  }
});

const handleRemove = () => {
  console.log('diremove');
}

const dataPreview = toRef(props, 'data_multi');

const removePreview = async (e) => {
  let index = _.findIndex(dataPreview.value, { url: e });
  dataPreview.value.splice(index, 1);
  message.success('dokumen dihapus');
  required.value = false;
  // const response = await useApi({
  //   method: 'DELETE',
  //   api: `image_deleted/${e}`,
  //   token: userToken
  // });
  // if (!response.ok) {
  //   message.error("error");
  // } else {
  //   message.success('dokumen dihapus');
  // }
}
// onMounted(()=>resizeImage());
</script>
