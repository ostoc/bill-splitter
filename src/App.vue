<template>
  <div class="sharers">
    <h3>Sharers</h3>
    <div class="row mb-1">
      <div
        v-for="sharer in sharers"
        :key="sharer"
        class="sharer"
      >
        <span>{{ sharer }}</span>
        <button
          class="sharer__delete-button"
          aria-label="Remove sharer"
          @click="handleRemoveSharer(sharer)"
        >
          x
        </button>
      </div>
    </div>
    <div class="row mb-1">
      <input
        v-model="newSharer"
        style="flex: 5 1"
        placeholder="New sharer's name"
        @keyup.enter="handleAddSharer"
      >
      <button
        class="ml-1"
        :disabled="!newSharer"
        @click="handleAddSharer"
      >
        Add
      </button>
    </div>
  </div>

  <div class="expenses">
    <h3>Add Expense</h3>
    <div class="row mb-1">
      <input
        v-model="recordTitle"
        placeholder="Title"
        style="flex: 2 1"
      >
      <input
        v-model.number="amount"
        class="ml-1"
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        style="flex: 1 1"
      >
      <select
        v-model="paidBy"
        class="ml-1"
        style="flex: 2 1"
      >
        <option
          value=""
          disabled
        >
          Select paid by
        </option>
        <option
          v-for="sharer in sharers"
          :key="sharer"
          :value="sharer"
        >
          {{ sharer }}
        </option>
      </select>
      <button
        class="ml-1"
        :disabled="!isExpenseFormValid"
        @click="handleAddExpense"
      >
        Add
      </button>
    </div>
    <div class="row">
      <button
        v-for="sharer in sharers"
        :key="sharer"
        :class="['sharer-selector', { 'sharer-selector--selected': selectedSharers.has(sharer) }]"
        @click="toggleSharer(sharer)"
      >
        {{ sharer.substring(0, 3) }}
      </button>
    </div>
    <div
      class="shares-control"
      style="justify-content: space-between"
    >
      <div>Shared by {{ selectedSharers.size }} person{{ selectedSharers.size !== 1 ? 's' : '' }}</div>
      <div>
        <button
          class="secondary ml-1"
          @click="selectAllSharers"
        >
          Select All
        </button>
        <button
          class="secondary ml-1"
          @click="removeAllSharers"
        >
          Remove All
        </button>
      </div>
    </div>
  </div>

  <ExpenseTable
    :table-data="expenseRecords"
    @delete="handleDeleteExpense"
    @delete-all="handleDeleteAllExpenses"
  />
  <TransferTable
    :table-data="transferBook"
    @mark="handleMarkPaid"
  />

  <div class="row">
    <button
      class="danger"
      style="flex: 1 1"
      @click="handleClearData"
    >
      Delete
    </button>
    <button
      class="secondary ml-1"
      @click="redirectToGitHub"
    >
      GitHub
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ExpenseTable from './components/ExpenseTable.vue';
import TransferTable from './components/TransferTable.vue';
import { useBillSplitter } from './composables/useBillSplitter.js';

// Use the composable for state management
const {
  sharers,
  expenseRecords,
  transferBook,
  initializeFromStorage,
  clearAllData,
  addSharer,
  removeSharer,
  addExpense,
  deleteExpense,
  deleteAllExpenses,
  toggleTransferPaid,
} = useBillSplitter();

// Local state
const newSharer = ref('');
const recordTitle = ref('');
const amount = ref(0);
const paidBy = ref('');
const selectedSharers = ref(new Set());

// Computed: Check if expense form is valid
const isExpenseFormValid = computed(() => {
  return (
    amount.value > 0 &&
    recordTitle.value.trim() !== '' &&
    paidBy.value !== '' &&
    selectedSharers.value.size > 0
  );
});

// Sharer handlers
const handleAddSharer = () => {
  const name = newSharer.value.trim();
  if (!name) return;

  try {
    addSharer(name);
    selectedSharers.value.add(name);
    newSharer.value = '';
  } catch (error) {
    alert(error.message);
  }
};

const handleRemoveSharer = (sharer) => {
  selectedSharers.value.delete(sharer);
  removeSharer(sharer);
};

// Expense handlers
const handleAddExpense = () => {
  if (!isExpenseFormValid.value) return;

  try {
    addExpense({
      title: recordTitle.value.trim(),
      names: Array.from(selectedSharers.value),
      amount: amount.value,
      paidBy: paidBy.value,
    });

    // Reset form
    recordTitle.value = '';
    amount.value = 0;
    paidBy.value = '';
    selectAllSharers();
  } catch (error) {
    alert(error.message);
  }
};

const handleDeleteExpense = (index) => {
  deleteExpense(index);
};

const handleDeleteAllExpenses = () => {
  deleteAllExpenses();
};

// Transfer handlers
const handleMarkPaid = (index) => {
  toggleTransferPaid(index);
};

// Sharer selection
const toggleSharer = (sharer) => {
  if (selectedSharers.value.has(sharer)) {
    selectedSharers.value.delete(sharer);
  } else {
    selectedSharers.value.add(sharer);
  }
  // Trigger reactivity
  selectedSharers.value = new Set(selectedSharers.value);
};

const selectAllSharers = () => {
  selectedSharers.value = new Set(sharers.value);
};

const removeAllSharers = () => {
  selectedSharers.value = new Set();
};

// Data management
const handleClearData = () => {
  const deleteText = 'Are you sure? The cloud data will be deleted!';
  if (confirm(deleteText)) {
    clearAllData();
    selectedSharers.value = new Set();
  }
};

const redirectToGitHub = () => {
  window.open('https://github.com/ostoc/bill-splitter');
};

// Initialize on mount
onMounted(() => {
  initializeFromStorage();
  // Initialize selected sharers with all sharers
  selectAllSharers();
});
</script>
