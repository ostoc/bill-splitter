<template>
  <table>
    <tr>
      <th width="60%">Paid by</th>
      <th width="20%">Amount</th>
      <th width="20%">Action</th>
    </tr>
    <tr v-for="(data, index) in tableData" :key="index">
      <td v-text="data.name" />
      <td v-text="data.amount" />
      <td>
        <button class="secondary" @click="deleteData(index)">Delete</button>
      </td>
    </tr>
    <tr>
      <td colspan="4" class="total">Total Paid: {{ paidTotal }}</td>
    </tr>
  </table>
</template>

<script>
import { totalAmount } from "@/components/util";
export default {
  name: "ExpenseTable",
  props: ["tableData"],
  computed: {
    paidTotal() {
      return totalAmount(this.tableData);
    },
  },
  methods: {
    deleteData(index) {
      this.$emit("delete", index);
    },
  },
};
</script>
