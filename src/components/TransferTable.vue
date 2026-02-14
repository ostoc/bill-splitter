<template>
  <table class="transfer-book">
    <thead>
      <tr>
        <th
          colspan="2"
          class="header"
        >
          Transfer Book
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="tableData.length === 0"
        class="no-data"
      >
        <td colspan="2">
          Looks like all clear 🆑
        </td>
      </tr>
      <tr
        v-for="(record, index) in tableData"
        :key="record.id ?? index"
        :class="{ paid: record.paid }"
      >
        <td>
          <strong>{{ record.from }}</strong>
          needs transfer
          <strong>{{ formatAmount(record.amount) }}</strong>
          to
          <strong>{{ record.to }}</strong>
        </td>
        <td class="action">
          <button
            class="secondary"
            @click="emit('mark', index)"
          >
            {{ record.paid ? 'Unmark' : 'Mark as paid' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
/**
 * TransferTable Component
 * Displays the transfer book showing who needs to pay whom
 * Uses Vue 3 Composition API with <script setup>
 */

defineProps({
  tableData: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(['mark']);

// Helper: Format amount to 2 decimal places
const formatAmount = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
};
</script>

<style scoped>
.transfer-book {
  background: #ffdddd;
  width: 100%;
}

.header {
  font-size: 1.2rem;
  font-weight: 600;
}

.no-data {
  text-align: center;
  color: #888;
  height: 4rem;
}

tr.paid {
  text-decoration: line-through;
  opacity: 0.7;
}

.action {
  text-align: right;
}

strong {
  font-size: 1.1rem;
}
</style>
