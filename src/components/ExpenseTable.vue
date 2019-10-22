<template>
  <table>
    <tr>
      <th width="30%">Title</th>
      <th width="40%">Shared By</th>
      <th width="15%">Amount</th>
      <th width="15%">Action</th>
    </tr>
    <tr v-for="(data, index) in tableData" :key="index">
      <td class="title">{{ data.title }}</td>
      <td>
        <span v-for="name in data.names" :key="name">{{ name }}</span>
      </td>
      <td>{{ data.amount }}</td>
      <td>
        <button class="secondary" @click="deleteData(index)">Delete</button>
      </td>
    </tr>
    <tr>
      <td colspan="4" class="total">Total Spend: {{ spendTotal }}</td>
    </tr>
  </table>
</template>

<script>
import { totalAmount } from "@/components/util";
export default {
  name: "ExpenseTable",
  props: ["tableData"],
  computed: {
    spendTotal() {
      return totalAmount(this.tableData);
    }
  },
  methods: {
    deleteData(index) {
      this.$emit("delete", index);
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
