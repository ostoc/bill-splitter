<template>
  <table class="expense-table">
    <tr>
      <th colspan="5" class="header">Spend</th>
    </tr>
    <tr>
      <th>Item</th>
      <th>Paid by</th>
      <th>Shared By</th>
      <th>Amount</th>
      <th width="100" class="action">Action</th>
    </tr>
    <tr v-for="(data, index) in tableData" :key="index">
      <td class="title">{{ data.title }}</td>
      <td>{{ data.paidBy }}</td>
      <td>
        <span v-for="(name, index) in data.names" :key="name">
          <span v-text="name" />
          <span v-if="index < data.names.length - 1" v-text="','" />
        </span>
      </td>
      <td>{{ formatedAmount(data.amount) }}</td>
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
          v-text="'Remove All'"
          @click="deleteAll"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import { totalAmount, formatCurrency } from "../util.js";
import { computed } from "vue";
export default {
  name: "ExpenseTable",
  props: {
    tableData: {
      type: Array,
      default: [],
    },
  },

  setup(props, { emit }) {
    const spendTotal = computed(() => {
      return totalAmount(props.tableData);
    });
    const formatedAmount = (amount) => {
      return formatCurrency(amount);
    };
    const deleteRow = (index) => {
      emit("delete", index);
    };
    const deleteAll = () => {
      emit("deleteAll");
    };
    return {
      spendTotal,
      formatedAmount,
      deleteRow,
      deleteAll,
    };
  },
};
</script>

<style>
.expense-table {
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
