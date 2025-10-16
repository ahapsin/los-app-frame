<template>
  <n-card title="form isian analisa">
    <template #header-extra>
      <n-tag>Modal Kerja</n-tag>
      <n-tag>Investasi</n-tag>
      <n-tag>Konsumsi</n-tag>
    </template>
    <div class="p-2 group border flex justify-between  items-center rounded-lg">
      <div class="flex gap-2">
        <n-avatar>P</n-avatar>
        <div class="flex flex-col">
          <small>NO DEBITUR</small>
          <strong>NAMA DEBITUR</strong>
        </div>

      </div>
      <div class="flex gap-2">
        <n-button type="primary" secondary @click="modalSt = true">Preview Form</n-button>
        <n-button type="info" @click="modalSt = true">Detail</n-button>
      </div>
    </div>
    <div class="p-4">
      <n-space vertical>
        <n-collapse>
          <n-steps vertical v-model:current="currentRef">
            <n-step v-for="schema in schemaScoring" :key="schema.id"
                    :title="schema.kriteria"
            >
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between p-2 bg-slate-200 rounded-lg" v-if="schema.key === 2">
                  <n-form>
                    <n-space>
                      <n-form-item :label="uang.title" v-for="uang in keuangan" :key="uang.id">
                        <n-input :placeholder="`Masukan ${uang.title}`">
                          <template #suffix>{{ uang.suff }}</template>
                        </n-input>
                      </n-form-item>
                    </n-space>
                  </n-form>
                </div>
                <div class="flex items-center justify-between p-2 bg-slate-200 rounded-lg"
                     v-for="header in schema.scoring">
                  <div class="flex flex-col w-full">
                    <div class="text-xl font-bold py-2">{{ header.header }}</div>
                    <div class="p-2 bg-white/50 rounded-lg">
                      <div class="flex gap-4 items-center">
                        <n-slider v-model:value="header.nilai" :marks="marks">
                        </n-slider>
                        <div class="text-2xl w-[50px] justify-center font-bold border flex rounded-lg">{{
                            header.nilai
                          }}
                        </div>
                      </div>
                      <div>{{ header.selected_param = findMatchParameter(header.param, header.nilai).parameter }}</div>
                    </div>

                    <n-collapse-item class="p-2" :name="header.header"
                                     :title="`catatan ${header.header.toLowerCase()}`">
                      <n-input :autosize="{
        minRows: 3,
        maxRows: 5,
      }" type="textarea" v-model:value="header.catatan"
                               :placeholder="`isi catatan ${header.header.toLowerCase()} disini ...`"/>
                    </n-collapse-item>
                  </div>
                  <div class="flex gap-2 items-center">

                  </div>
                </div>
              </div>
            </n-step>
          </n-steps>
        </n-collapse>
      </n-space>
    </div>
  </n-card>
  <n-modal v-model:show="modalSt">
    <n-card class="w-11/12"
            title="Data Detail Debitur"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
    >
      <div class="flex flex-col gap-2">
        <div class="flex border-b-2">
          <div class="justify-center">
            <div class="border-r-2 p-4"><img :src="applogo" class="w-[42px]"/>
            </div>
          </div>
          <div class="p-4 flex items-center border-r-2">FORMULIR ANALISA KREDIT</div>
          <div class="p-4 flex items-center">NOMOR:</div>
        </div>
        <div class="font-bold"> Data Detail Debitur</div>
        <div class="border-2 p-2">
          <div>data debitur</div>
        </div>
        <div v-for="(scoring,i) in schemaScoring" :key="scoring.id">
          <div class="font-bold"> {{ i + 1 }}. {{ scoring.kriteria }}</div>
          <table class="w-full ">
            <tr v-for="item in scoring.scoring" :key="item.id">
              <td class="border border-black"><b>{{ item.header }}</b><br><small>{{ item.selected_param }}</small></td>
              <td class="border border-black font-bold" width="40" align="center">{{ item.nilai }}</td>
            </tr>
          </table>

        </div>
      </div>
    </n-card>
  </n-modal>

</template>
<script setup>
import _ from "lodash";

const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
import {useScoringAnalis} from "../../../../stores/analis.js";

const marks = {
  0: '0',
  50: '50',
  100: '100'
}
const keuangan = reactive([{
  title: "Omzet",
  value: null,
  suff: "/bulan"
},
  {
    title: "Margin Keuntungan",
    value: null,
    suff: "%"
  }, {
    title: "Pendapatan lain-lain",
    value: null,
    suff: "/bulan"
  }, {
    title: "Biaya Hidup, pendidikan dll",
    value: null,
    suff: "/bulan"
  }, {
    title: "Biaya Operasional usaha",
    value: null,
    suff: "/bulan"
  },])
const schemaScoring = reactive(useScoringAnalis);
const currentRef = ref(1);
const modalSt = ref(false);
const stStep1 = () => {
  modalSt.value = true;
}

const findMatchParameter = (col, val) => {
  let a = _.findIndex(col, function (o) {
    return o.range_min <= val && o.range_max >= val;
  });
  return a > 0 ? col[a] : col[0];
}
const currentStatus = ref("process");
</script>