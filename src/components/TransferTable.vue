<template>
  <table class="transfer-book">
    <th colspan="2" class="header">Transfer Book</th>
    <tr v-if="tableData.length === 0" class="no-data">
      <td>Looks like all clear 🆑</td>
    </tr>
    <tr
      v-for="(record, index) in tableData"
      :key="index"
      :class="record.paid ? 'paid' : ''"
    >
      <td>
        <strong>{{ record.from }}</strong>
        needs transfer
        <strong v-text="formatedAmount(record.amount)" />
        to
        <strong v-text="record.to" />
      </td>
      <td class="action">
        <button
          class="secondary"
          @click="markAsPaid(index)"
          v-text="record.paid ? 'Unmark' : 'Mark as paid'"
        />
      </td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from "vue";
import { formatCurrency } from "../util.js";
const emit = defineEmits(["mark"]);
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
const markAsPaid = index => {
  emit("mark", index);
};
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
tr.paid {
  text-decoration: line-through;
}
.action {
  text-align: right;
}
strong {
  font-size: 1.1rem;
}
</style>
