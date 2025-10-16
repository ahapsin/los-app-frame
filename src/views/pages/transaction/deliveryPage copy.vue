<template>
  <n-card>
    <template #header>Serah Terima Jaminan</template>
    <template #header-extra>
      <n-button
        v-show="!searchField"
        strong
        secondary
        circle
        @click="handleExpand"
      >
        <template #icon>
          <n-icon>
            <full-icon />
          </n-icon>
        </template>
      </n-button>
    </template>
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      :size="size"
      label-width="auto"
    >
      <n-form-item label="Transaksi" :show-feedback="false" class="w-full">
        <n-grid :cols="2">
          <n-form-item-gi path="nestedValue.path1">
            <n-switch
              size="large"
              :rail-style="railStyle"
              :disabled="searchField"
            >
              <template #checked> Terima Jaminan</template>
              <template #unchecked> Serah Jaminan </template>
            </n-switch>
          </n-form-item-gi>
          <n-form-item-gi path="nestedValue.path2">
            <n-auto-complete
              v-model:value="valOptSearch"
              :options="listCustomer"
              :on-select="handleInputSearch"
            >
              <template
                #default="{
                  handleInput,
                  handleBlur,
                  handleFocus,
                }"
              >
                <n-input
                  clearable
                  @clear="handleCloseNasabah"
                  :value="valOptSearch"
                  placeholder="Pelanggan"
                  @input="handleInput"
                  @focus="handleFocus"
                  @blur="handleBlur"
                >
                  <template #prefix>
                    <n-icon :component="searchIcon" />
                  </template>
                </n-input>
              </template>
            </n-auto-complete>
          </n-form-item-gi>
        </n-grid>
      </n-form-item>
      <div v-show="searchField" class="flex gap-4">
        <n-card title="Data Nasabah" :bordered="false" embedded size="small">
          <n-grid :cols="2">
            <n-gi>
              <div class="flex">
                <label class="w-24">No Pelanggan</label
                ><span>
                  <n-text strong>{{ selectedCustomer.CUST_CODE }}</n-text></span
                >
              </div>
              <div class="flex">
                <label class="w-24">Nama </label
                ><span>
                  <n-text strong>{{ selectedCustomer.NAME }}</n-text></span
                >
              </div>
              <div class="flex">
                <label class="w-24">Tanggal Lahir</label
                ><span>
                  <n-text strong>{{ selectedCustomer.BIRTHDATE }}</n-text></span
                >
              </div>
            </n-gi>
            <n-gi>
              <div class="flex">
                <label class="w-24">No KTP</label
                ><span>
                  <n-text strong>{{ selectedCustomer.ID_NUMBER }}</n-text></span
                >
              </div>
              <div class="flex">
                <label class="w-24">Alamat</label
                ><span>
                  <n-text strong
                    >{{ selectedCustomer.ADDRESS }}, RT
                    {{ selectedCustomer.RT }} RW
                    {{ selectedCustomer.RW }}</n-text
                  ></span
                >
              </div>
              <div class="flex">
                <label class="w-24">Ibu Kandung</label
                ><span>
                  <n-text strong>{{
                    selectedCustomer.MOTHER_NAME
                  }}</n-text></span
                >
              </div>
            </n-gi>
          </n-grid>
        </n-card>
        <n-card title="Data Jaminan" :bordered="false" embedded size="small">
          <n-grid :cols="1">
            <n-gi>
              <div class="flex">
                <label class="w-1/3">No PK</label
                ><span>
                  <n-text strong>{{ selectedCustomer.CUST_CODE }}</n-text></span
                >
              </div>
              <div class="flex">
                <label class="w-1/3">BPKB No </label
                ><span> <n-text strong>##no bpkb##</n-text></span>
              </div>
              <div class="flex">
                <label class="w-1/3">BPKB atas nama</label
                ><span> <n-text strong>##atasnama bpkb##</n-text></span>
              </div>
              <div class="flex">
                <label class="w-1/3">Merk / Type/ Tahun</label
                ><span>
                  <n-text strong
                    >KAWASAKI/V01153 - NINJA150LVR/SS/2010</n-text
                  ></span
                >
              </div>
              <div class="flex">
                <label class="w-1/3">Warna/No.Polisi</label
                ><span> <n-text strong>HITAM/E 123 yy</n-text></span>
              </div>
              <div class="flex">
                <label class="w-1/3">No. Rangka/Mesin</label
                ><span> <n-text strong>norangka/nomesin</n-text></span>
              </div>
            </n-gi>
          </n-grid>
        </n-card>
      </div>
      <div class="pt-4">
        <n-form-item label="Tujuan">
          <n-input placeholder="tujuan" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary"> Simpan </n-button>
        </n-form-item>
      </div>
    </n-form>
  </n-card>
</template>
<script setup>
import { useApi } from "../../../helpers/axios";
import { useSearch } from "../../../helpers/searchObject";
import router from "../../../router";
import {
  SearchRound as searchIcon,
  OpenInFullRound as fullIcon,
} from "@vicons/material";
import { computed, onMounted, ref } from "vue";
const searchField = ref(false);
const valOptSearch = ref(null);
const createColumns = () => {
  return [
    {
      type: "selection",
      multiple: false,
    },
    {
      title: "No Kontrak",
      key: "loan_number",
    },
    {
      title: "NO PK",
      key: "no_pk",
    },
    {
      title: "Sisa Angsuran",
      key: "sisa_angsuran",
    },
    {
      title: "Total Bayar",
      key: "total_bayar",
    },
  ];
};
const dataCustomer = ref([]);
const selectedCustomer = ref([]);
const getDataCustomer = async () => {
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "GET",
    api: "customer",
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    dataCustomer.value = response.data;
  }
};
const handleInputSearch = (e) => {
  selectedCustomer.value = e;
  searchField.value = true;
  getCreditCustomer();
};
const handleCloseNasabah = () => {
  searchField.value = false;
  valOptSearch.value = null;
  console.log("search");
};
const creditCustomer = ref([]);
const getCreditCustomer = async () => {
  const dynamicBody = {
    cust_code: "005240600001",
  };
  let userToken = localStorage.getItem("token");
  const response = await useApi({
    method: "POST",
    api: "kontrak_fasilitas",
    data: dynamicBody,
    token: userToken,
  });
  if (!response.ok) {
    console.log(reponse.error);
  } else {
    creditCustomer.value = response.data;
  }
};
const listCustomer = computed(() => {
  let dataList = useSearch(dataCustomer.value, valOptSearch.value);
  return dataList.map((suffix) => {
    return {
      label: suffix.CUST_CODE + "-" + suffix.NAME,
      value: suffix,
    };
  });
});
const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#d03050";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#008000";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};
const handleExpand = () => {
  console.log("asdasdas");
  const fullPage = router.resolve({ name: "expand transaction" });
  window.open(fullPage.href, "_blank");
};
onMounted(() => getDataCustomer());
</script>
