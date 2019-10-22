<template>
  <table class="expense-table">
    <tr>
      <th width="30%">Title</th>
      <th width="40%">Shared By</th>
      <th width="20%">Paid by</th>
      <th width="15%">Amount</th>
      <th width="80px" class="action">Action</th>
    </tr>
    <tr v-for="(data, index) in tableData" :key="index">
      <td class="title">{{ data.title }}</td>
      <td>
        <span v-for="(name, index) in data.names" :key="name">
          <span v-text="name" />
          <span v-if="index < data.names.length - 1" v-text="','" />
        </span>
      </td>
      <td>{{ data.paidBy }}</td>
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
import { totalAmount, formatCurrency } from "@/components/util";
export default {
  name: "ExpenseTable",
  props: ["tableData"],
  computed: {
    spendTotal() {
      return totalAmount(this.tableData);
    }
  },
  methods: {
    formatedAmount(amount) {
      return formatCurrency(amount);
    },
    deleteRow(index) {
      this.$emit("delete", index);
    },
    deleteAll() {
      this.$emit("deleteAll");
    }
  }
};
</script>

<style scoped>
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
</style>
