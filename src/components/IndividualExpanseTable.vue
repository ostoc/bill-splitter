<template>
  <table>
    <tr>
      <th v-for="(header,index) in tableData" :key="index" v-text="header.name"></th>
    </tr>
    <tr>
      <td v-for="(item,index) in tableData" :key="index" v-text="item.balance"></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "IndividualExpanseTable",
  props: ["data"],
  computed: {
    tableData() {
      return this.data;
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


