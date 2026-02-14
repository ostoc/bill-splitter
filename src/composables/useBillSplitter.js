import { ref, computed, watch } from 'vue';

/**
 * Composable for managing bill splitting state and logic
 * Uses Vue 3 Composition API with reactive refs and computed properties
 */
export function useBillSplitter() {
  // Reactive state
  const sharers = ref([]);
  const expenseRecords = ref([]);
  const transferBook = ref([]);

  // Storage key constants
  const STORAGE_KEYS = {
    sharers: 'sharers',
    expenseRecords: 'expenseRecords',
    transferBook: 'transferBook',
  };

  // Load data from localStorage
  const loadFromStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Initialize data from localStorage
  const initializeFromStorage = () => {
    sharers.value = loadFromStorage(STORAGE_KEYS.sharers);
    expenseRecords.value = loadFromStorage(STORAGE_KEYS.expenseRecords);
    transferBook.value = loadFromStorage(STORAGE_KEYS.transferBook);
    recalculateTransfers();
  };

  // Clear all data
  const clearAllData = () => {
    sharers.value = [];
    expenseRecords.value = [];
    transferBook.value = [];
    localStorage.clear();
  };

  // Computed: Calculate individual expenses and balances
  const individualExpenses = computed(() => {
    const balances = sharers.value.map(name => ({
      name,
      balance: 0,
      spend: 0,
      paid: 0,
    }));

    for (const record of expenseRecords.value) {
      const sharedAmount = record.amount / record.names.length;

      // Add spend to each participant
      for (const name of record.names) {
        const sharer = balances.find(item => item.name === name);
        if (sharer) {
          sharer.spend += sharedAmount;
        }
      }

      // Add payment to payer
      const payer = balances.find(item => item.name === record.paidBy);
      if (payer) {
        payer.paid += record.amount;
      }
    }

    // Calculate balance for each sharer
    return balances.map(item => ({
      ...item,
      balance: item.paid - item.spend,
    }));
  });

  // Helper: Round to 2 decimal places
  const round = (value) => Math.round(value * 100) / 100;

  // Calculate transfer book using optimized algorithm
  const recalculateTransfers = () => {
    const balances = individualExpenses.value.map(e => ({
      name: e.name,
      balance: round(e.balance),
    }));

    // Guard: if less than 2 balances, nothing to split
    if (!balances.length || balances.length < 2) {
      transferBook.value = [];
      return;
    }

    const transfers = [];

    // Continue until all balances are settled
    while (true) {
      // Sort by balance: debtors first (negative), creditors last (positive)
      balances.sort((a, b) => a.balance - b.balance);

      const debtor = balances[0];
      const creditor = balances[balances.length - 1];

      // Exit condition: everyone is settled
      if (round(debtor.balance) >= 0 || round(creditor.balance) <= 0) break;

      // Calculate amount to transfer
      const amount = round(Math.min(Math.abs(debtor.balance), creditor.balance));

      // Record the transaction
      transfers.push({
        from: debtor.name,
        to: creditor.name,
        amount,
        paid: false,
      });

      // Update balances
      debtor.balance = round(debtor.balance + amount);
      creditor.balance = round(creditor.balance - amount);
    }

    transferBook.value = transfers;
    saveToStorage(STORAGE_KEYS.transferBook, transferBook.value);
  };

  // Watch for changes and recalculate
  watch([sharers, expenseRecords], recalculateTransfers, { deep: true });

  // Sharer management
  const addSharer = (name) => {
    if (sharers.value.includes(name)) {
      throw new Error(`${name} is already in the list`);
    }
    sharers.value.push(name);
    saveToStorage(STORAGE_KEYS.sharers, sharers.value);
  };

  const removeSharer = (name) => {
    sharers.value = sharers.value.filter(item => item !== name);

    // Remove from selected sharers in expenses
    expenseRecords.value = expenseRecords.value
      .map(record => ({
        ...record,
        names: record.names.filter(n => n !== name),
      }))
      .filter(record => record.paidBy !== name && record.names.length > 0);

    saveToStorage(STORAGE_KEYS.sharers, sharers.value);
    saveToStorage(STORAGE_KEYS.expenseRecords, expenseRecords.value);
  };

  // Expense management
  const addExpense = (record) => {
    if (record.names.length === 0) {
      throw new Error('You need to select at least one person');
    }
    if (!record.amount || record.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!record.paidBy) {
      throw new Error('You need to select who paid');
    }

    expenseRecords.value.push({
      title: record.title,
      names: [...record.names],
      amount: record.amount,
      paidBy: record.paidBy,
    });

    saveToStorage(STORAGE_KEYS.expenseRecords, expenseRecords.value);
  };

  const deleteExpense = (index) => {
    expenseRecords.value.splice(index, 1);
    saveToStorage(STORAGE_KEYS.expenseRecords, expenseRecords.value);
  };

  const deleteAllExpenses = () => {
    expenseRecords.value = [];
    saveToStorage(STORAGE_KEYS.expenseRecords, expenseRecords.value);
  };

  // Transfer management
  const toggleTransferPaid = (index) => {
    if (transferBook.value[index]) {
      transferBook.value[index].paid = !transferBook.value[index].paid;
      saveToStorage(STORAGE_KEYS.transferBook, transferBook.value);
    }
  };

  // Computed: Total spend
  const totalSpend = computed(() => {
    return expenseRecords.value.reduce((total, record) => total + record.amount, 0);
  });

  return {
    // State
    sharers,
    expenseRecords,
    transferBook,

    // Computed
    individualExpenses,
    totalSpend,

    // Methods
    initializeFromStorage,
    clearAllData,
    addSharer,
    removeSharer,
    addExpense,
    deleteExpense,
    deleteAllExpenses,
    toggleTransferPaid,
    recalculateTransfers,
  };
}
