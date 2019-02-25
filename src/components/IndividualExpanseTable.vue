<template>
  <table>
    <tr>
      <th v-for="header in tableData" :key="header.name" v-text="header.name"></th>
    </tr>
    <tr>
      <td v-for="item in tableData" :key="item.balance" v-text="item.balance"></td>
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

