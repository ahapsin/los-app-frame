<script setup>
import { ref, computed, watch } from "vue"

// ================= FORM =================
const form = ref({
  P1: null,        // avg awal
  Q1: null,        // lot awal
  modal: null,     // modal total
  step: 3,         // jumlah step
  H: null,         // harga sekarang
  maxLoss: 3,      // target rugi max (%)

  basePrice: null, // harga awal avg down
  mode: "percent", // percent | tick
  gapPercent: 3,   // jarak %
  tick: 1,         // jarak tick

  prices: []       // harga per step (auto)
})

// ================= SYNC STEP =================
watch(
  () => form.value.step,
  (val) => {
    form.value.prices = Array.from(
      { length: val },
      (_, i) => form.value.prices[i] ?? null
    )
  },
  { immediate: true }
)

// ================= GENERATE HARGA =================
const generatePrices = () => {
  const { basePrice, step, mode, gapPercent, tick } = form.value
  if (!basePrice || !step) return

  form.value.prices = []

  for (let i = 0; i < step; i++) {
    let price = basePrice

    if (mode === "percent") {
      price = basePrice * Math.pow(1 - gapPercent / 100, i)
    }

    if (mode === "tick") {
      price = basePrice - tick * i
    }

    form.value.prices.push(Math.max(1, Math.floor(price)))
  }
}

// ================= MODAL PER STEP =================
const modalPerStep = computed(() => {
  if (!form.value.modal || !form.value.step) return 0
  return form.value.modal / form.value.step
})

// ================= SIMULASI =================
const simulasi = computed(() => {
  const { P1, Q1, H, prices, maxLoss } = form.value
  if (!P1 || !Q1 || !H) return []

  let totalLot = Q1
  let totalValue = P1 * Q1
  let result = []

  prices.forEach((price, i) => {
    if (!price) return

    const lot = Math.floor(modalPerStep.value / (price * 100))
    if (lot <= 0) return

    totalLot += lot
    totalValue += lot * price

    const avg = totalValue / totalLot
    const pl = ((H - avg) / avg) * 100

    result.push({
      step: i + 1,
      price,
      lot,
      totalLot,
      avg: avg.toFixed(2),
      pl: pl.toFixed(2),
      danger: pl < -maxLoss
    })
  })

  return result
})

// ================= FINAL STATUS =================
const finalStatus = computed(() => {
  if (!simulasi.value.length) return null

  const last = simulasi.value.at(-1)
  if (last.pl < -form.value.maxLoss) {
    return {
      type: "error",
      text: `❌ Masih rugi ${last.pl}% (batas -${form.value.maxLoss}%)`
    }
  }

  return {
    type: "success",
    text: `✅ Rugi terkendali (${last.pl}%)`
  }
})
</script>

<template>
  <n-card title="Avg Down Simulator (Pro)" size="small">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <!-- INPUT -->
      <div>
        <n-form :model="form" label-width="180" label-placement="left">
          <n-form-item label="Avg Awal">
            <n-input-number v-model:value="form.P1" />
          </n-form-item>

          <n-form-item label="Lot Awal">
            <n-input-number v-model:value="form.Q1" />
          </n-form-item>

          <n-form-item label="Modal Total (Rp)">
            <n-input-number v-model:value="form.modal" />
          </n-form-item>

          <n-form-item label="Jumlah Step">
            <n-input-number v-model:value="form.step" :min="1" />
          </n-form-item>

          <n-form-item label="Harga Sekarang">
            <n-input-number v-model:value="form.H" />
          </n-form-item>

          <n-form-item label="Target Rugi Max (%)">
            <n-input-number v-model:value="form.maxLoss" :min="0" />
          </n-form-item>

          <n-divider />

          <n-form-item label="Harga Awal Entry">
            <n-input-number v-model:value="form.basePrice" />
          </n-form-item>

          <n-form-item label="Mode Harga">
            <n-select
              v-model:value="form.mode"
              :options="[
                { label: 'Turun Persen', value: 'percent' },
                { label: 'Turun Tick', value: 'tick' }
              ]"
            />
          </n-form-item>

          <n-form-item label="Jarak (%)" v-if="form.mode === 'percent'">
            <n-input-number v-model:value="form.gapPercent" />
          </n-form-item>

          <n-form-item label="Jarak Tick" v-if="form.mode === 'tick'">
            <n-input-number v-model:value="form.tick" />
          </n-form-item>

          <n-form-item>
            <n-button type="primary" block @click="generatePrices">
              Generate Harga Entry
            </n-button>
          </n-form-item>
        </n-form>
      </div>

      <!-- INFO -->
      <div>
        <n-descriptions bordered size="small" :column="1">
          <n-descriptions-item label="Modal / Step">
            Rp {{ modalPerStep.toLocaleString("id-ID") }}
          </n-descriptions-item>
        </n-descriptions>

        <div v-if="finalStatus" class="mt-3">
          <n-alert :type="finalStatus.type">
            {{ finalStatus.text }}
          </n-alert>
        </div>
      </div>

      <!-- TABLE -->
      <div>
        <n-table size="small" bordered>
          <thead>
            <tr>
              <th>Step</th>
              <th>Harga</th>
              <th>Lot</th>
              <th>Total Lot</th>
              <th>Avg</th>
              <th>P/L (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in simulasi" :key="row.step">
              <td>{{ row.step }}</td>
              <td>{{ row.price }}</td>
              <td>{{ row.lot }}</td>
              <td>{{ row.totalLot }}</td>
              <td>{{ row.avg }}</td>
              <td>
                <n-text :type="row.danger ? 'error' : 'success'">
                  {{ row.pl }}%
                </n-text>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>

    </div>
  </n-card>
</template>
