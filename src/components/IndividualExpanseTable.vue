<template>
  <table>
    <tr>
      <th
        v-for="(header, index) in tableData"
        :key="index"
        v-text="header.name"
      ></th>
    </tr>
    <tr>
      <td
        v-for="(item, index) in tableData"
        :key="index"
        v-text="displayBalance(item.balance)"
      ></td>
    </tr>
  </table>
</template>

<script>
import formatCurrency from "./util.js";
export default {
  name: "IndividualExpanseTable",
  props: ["data"],
  computed: {
    tableData() {
      return this.data;
    }
  },
  methods: {
    displayBalance(value) {
      return formatCurrency(value);
    }
  }
};
</script>
<style lang="css">
table {
  width: 100%;
}
th {
  background: #ddd;
}
td {
  border-bottom: 1px solid #888;
}
</style>
