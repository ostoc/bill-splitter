<template>
  <table>
    <tr>
      <th>Title</th>
      <th>Shared By</th>
      <th>Amount</th>
    </tr>
    <tr v-for="(data, index) in tableData" :key="index">
      <td>{{ data.title }}</td>
      <td>
        <span v-for="name in data.names" :key="name">{{ name }}</span>
      </td>
      <td>{{ data.amount }}</td>
    </tr>
    <tr>
      <td colspan="3">Total: {{ spendTotal }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "ExpenseTable",
  props: ["tableData"],
  computed: {
    spendTotal() {
      let total = 0;
      this.tableData.forEach(record => {
        total = parseFloat(total) + parseFloat(record.amount);
      });
      return total;
    }
  }
};
</script>

<style scoped>
table {
}
</style>
