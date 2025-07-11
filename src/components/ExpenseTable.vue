<template>
  <div class="table-container">
    <table class="expense-table">
      <colgroup>
        <col style="width: 30%" />
        <col style="width: 15%" />
        <col style="width: 35%" />
        <col style="width: 8%" />
        <col style="width: 12%" />
      </colgroup>
      <tr>
        <th colspan="5" class="header">Spend</th>
      </tr>
      <tr>
        <th>Item</th>
        <th>Paid by</th>
        <th>Shared By</th>
        <th align="right">Amount</th>
        <th class="action">Action</th>
      </tr>
      <tr v-for="(data, index) in tableData" :key="index">
        <td class="title">{{ data.title }}</td>
        <td>{{ data.paidBy }}</td>
        <td>
          <span v-for="(name, index) in data.names" :key="index">
            <span v-text="name" />
            <span v-if="index < data.names.length - 1" v-text="','" />
          </span>
        </td>
        <td align="right">{{ formatedAmount(data.amount) }}</td>
        <td class="action">
          <button class="secondary" @click="deleteRow(index)">Delete</button>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="total">
          Total Spend: {{ formatedAmount(spendTotal) }}
        </td>
        <td colspan="2" class="action">
          <button
            v-if="tableData.length"
            class="secondary"
            @click="deleteAll"
            v-text="'Remove All'"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { totalAmount, formatCurrency } from "../util.js";
import { computed } from "vue";
const emit = defineEmits(["delete", "deleteAll"]);
const props = defineProps({
  tableData: {
    type: Array,
    default: null,
  },
});
const spendTotal = computed(() => {
  return totalAmount(props.tableData);
});
const formatedAmount = amount => {
  return formatCurrency(amount);
};

const deleteRow = index => {
  emit("delete", index);
};
const deleteAll = () => {
  emit("deleteAll");
};
</script>

<style>
.table-container {
  width: 100%;
  overflow-x: auto;
}
.expense-table {
  min-width: 600px;
  background: #d5ece8;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
}

.action {
  text-align: right;
}

.header {
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
