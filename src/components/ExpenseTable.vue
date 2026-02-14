<template>
  <div class="table-container">
    <table class="expense-table">
      <colgroup>
        <col style="width: 30%">
        <col style="width: 15%">
        <col style="width: 35%">
        <col style="width: 8%">
        <col style="width: 12%">
      </colgroup>
      <tr>
        <th
          colspan="5"
          class="header"
        >
          Spend
        </th>
      </tr>
      <tr>
        <th>Item</th>
        <th>Paid by</th>
        <th>Shared By</th>
        <th align="right">
          Amount
        </th>
        <th class="action">
          Action
        </th>
      </tr>
      <tr
        v-for="(data, index) in tableData"
        :key="data.id ?? index"
      >
        <td class="title">
          {{ data.title }}
        </td>
        <td>{{ data.paidBy }}</td>
        <td>
          <span
            v-for="(name, nameIndex) in data.names"
            :key="name"
          >
            <span>{{ name }}</span>
            <span v-if="nameIndex < data.names.length - 1">,</span>
          </span>
        </td>
        <td align="right">
          {{ formatAmount(data.amount) }}
        </td>
        <td class="action">
          <button
            class="secondary"
            @click="emit('delete', index)"
          >
            Delete
          </button>
        </td>
      </tr>
      <tr v-if="tableData.length === 0">
        <td
          colspan="5"
          class="no-data"
        >
          No expenses added yet
        </td>
      </tr>
      <tr>
        <td
          colspan="3"
          class="total"
        >
          Total Spend: {{ formatAmount(totalSpend) }}
        </td>
        <td
          colspan="2"
          class="action"
        >
          <button
            v-if="tableData.length > 0"
            class="secondary"
            @click="emit('deleteAll')"
          >
            Remove All
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * ExpenseTable Component
 * Displays a table of expenses with total calculation
 * Uses Vue 3 Composition API with <script setup>
 */

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(['delete', 'deleteAll']);

// Computed: Calculate total spend
const totalSpend = computed(() => {
  return props.tableData.reduce((total, record) => total + record.amount, 0);
});

// Helper: Format amount to 2 decimal places
const formatAmount = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
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

.no-data {
  text-align: center;
  color: #888;
  padding: 2rem;
}

.total {
  font-weight: 600;
  padding: 0.5rem;
}
</style>
