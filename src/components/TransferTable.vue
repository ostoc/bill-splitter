<template>
  <table class="transfer-book">
    <th class="header">Transfer Book</th>
    <tr v-if="tableData.length === 0" class="no-data">
      <td>Looks like all clear 🆑</td>
    </tr>
    <tr v-for="(record, index) in tableData" :key="index">
      <td>
        <strong>{{ record.from }}</strong>
        needs transfer
        <strong v-text="formatedAmount(record.amount)" />
        to
        <strong v-text="record.to" />
      </td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from "vue";
import { formatCurrency } from "../util.js";
const props = defineProps({
  tableData: {
    type: Array,
    default: null,
  },
});
const tableData = computed(() => {
  return props.tableData;
});
const formatedAmount = amount => formatCurrency(amount);
</script>

<style scoped>
.transfer-book {
  background: #ffdddd;
}

.no-data {
  text-align: center;
  color: #888;
  height: 4rem;
}

strong {
  font-size: 1.1rem;
}
</style>
