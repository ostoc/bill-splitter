<template>
  <table class="transfer-book">
    <th class="header">Transfer Book</th>
    <tr class="no-data" v-if="tableData.length === 0">
      <td>Nothing is here</td>
    </tr>
    <tr v-for="(record, index) in tableData" :key="index">
      <td>
        <strong>{{ record.from }}</strong>
        needs transfer
        <strong v-text="formatedAmount(record.amount)" />
        to
        <strong v-text="record.to" />
      </td>
    </tr>
  </table>
</template>

<script>
import { formatCurrency } from "../util.js";
export default {
  name: "TransferTable",
  props: {
    tableData: {
      type: Array,
      default: [],
    },
  },

  setup(props) {
    const formatedAmount = (amount) => formatCurrency(amount);
    return {
      formatedAmount,
    };
  },
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
strong {
  font-size: 1.1rem;
}
</style>
