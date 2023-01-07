<template>
  <div class="row">
    <button v-if="!secret" class="full-width" @click="saveCloud">
      ☁️ Share
    </button>
    <div v-else class="row">
      <input disabled :value="shareUrl" style="flex: 5 1" />
      <button class="danger" @click="deleteCloud('delete')" style="flex: 1 1">
        Delete
      </button>
      <button style="flex: 1 1" @click="clearData('new')">New</button>
    </div>
  </div>
  <div class="sharers">
    <h3>Sharers</h3>
    <div class="row mb-1">
      <div v-for="(sharer, index) in sharers" :key="index" class="sharer">
        <span v-text="sharer" />
        <span
          class="sharer__delete-button"
          @click="removeSharer(sharer)"
          v-text="'x'"
        />
      </div>
    </div>
    <div class="row mb-1">
      <input
        v-model="newSharer"
        style="flex: 5 1"
        placeholder="New sharer's name"
        @keyup.enter="addSharer()"
      />
      <button
        :disabled="!newSharer"
        class="ml-1"
        @click="addSharer()"
        v-text="'Add'"
      />
    </div>
  </div>

  <div class="expenses">
    <h3>Add Expense</h3>
    <div class="row mb-1">
      <input v-model="recordTitle" placeholder="Title" style="flex: 2 1" />
      <input
        v-model="amount"
        class="ml-1"
        type="number"
        min="0"
        placeholder="Amount"
        style="flex: 1 1"
      />
      <select v-model="paidBy" class="ml-1" style="flex: 2 1">
        <option value disabled selected>Select paid by</option>
        <option
          v-for="(sharer, index) in sharers"
          :key="index"
          :value="sharer"
          v-text="sharer"
        />
      </select>
      <button
        class="ml-1"
        :disabled="!amount || !recordTitle || paidBy === ''"
        @click="addExpense"
        v-text="'Add'"
      />
    </div>
    <div class="row">
      <div v-for="(sharer, index) in sharers" :key="index">
        <div
          :class="sharerSelectorClass(sharer)"
          @click="chooseSharer(sharer)"
          v-text="sharer.substring(0, 3)"
        />
      </div>
    </div>
    <div class="shares-control" style="justify-content: space-between">
      <div>Shared by {{ selectedSharer.length }} person</div>
      <div>
        <button class="secondary ml-1" @click="selectAll">Select All</button>
        <button class="secondary ml-1" @click="removeAll">Remove All</button>
      </div>
    </div>
  </div>

  <ExpenseTable
    :table-data="expenseRecords"
    @delete="deleteExpense"
    @delete-all="deleteAllExpense"
  />
  <TransferTable :table-data="transferBook" />
  <div class="row">
    <button class="secondary ml-1" @click="redirectToGitHub">GitHub</button>
  </div>
</template>

<script setup>
import ExpenseTable from "./components/ExpenseTable.vue";
import TransferTable from "./components/TransferTable.vue";
import {
  getLocalStorage,
  billSplitter,
  getSecret,
  generetUrl,
} from "./util.js";
import { ref, onMounted, computed } from "vue";
import {
  createRecord,
  updateRecord,
  fetchRecord,
  deleteRecord,
} from "./supabase";

const amount = ref(0);
const selectedSharer = ref([]);
const transferBook = ref([]);
const recordTitle = ref("");
const newSharer = ref("");
const paidBy = ref("");
const sharers = ref([]);
const expenseRecords = ref([]);
const secret = ref("");

const clearData = type => {
  const deleteText = `Are you sure? The cloud data will be deleted!`;
  const newText = `Are you sure you? Remember to bookmark this page before you create a new one!`;
  if (confirm(type === "new" ? newText : deleteText)) {
    sharers.value = [];
    expenseRecords.value = [];
    transferBook.value = [];
    selectedSharer.value = [];
    secret.value = "";
    localStorage.clear();
    window.location.href = import.meta.env.VITE_BASE_URL;
  }
};

const saveData = () => {
  if (secret.value) {
    saveCloud();
  }
  localStorage.setItem("secret", JSON.stringify(sharers.value));
  localStorage.setItem("sharers", JSON.stringify(sharers.value));
  localStorage.setItem("expenseRecords", JSON.stringify(expenseRecords.value));
};
const addSharer = () => {
  if (sharers.value.includes(newSharer)) {
    alert(`${newSharer.value} is already in the list`);
    return;
  }
  sharers.value.push(newSharer.value);
  selectedSharer.value.push(newSharer.value);
  saveData();
  newSharer.value = null;
};

const removeSharer = sharer => {
  sharers.value = sharers.value.filter(item => item !== sharer);
  selectedSharer.value = selectedSharer.value.filter(item => item !== sharer);
  expenseRecords.value.forEach(record => {
    record.names = record.names.filter(name => name !== sharer);
  });
  expenseRecords.value = expenseRecords.value.filter(
    item => item.paidBy !== sharer
  );
  splitBill();
  saveData();
};

const deleteExpense = index => {
  expenseRecords.value.splice(index, 1);
  splitBill();
  saveData();
};

const addExpense = () => {
  let record = {
    title: recordTitle.value,
    names: [...selectedSharer.value],
    amount: amount.value,
    paidBy: paidBy.value,
  };
  if (record.names.length === 0 || record.amount === null) {
    alert("You need to select person or have amout");
    return;
  }
  if (record.amount < 0) {
    alert("Amount can't be negative");
    return;
  }
  expenseRecords.value.push(record);
  splitBill();
  saveData();
  recordTitle.value = "";
  amount.value = "";
};
const chooseSharer = sharer => {
  if (selectedSharer.value.includes(sharer)) {
    selectedSharer.value = selectedSharer.value.filter(
      selected => selected !== sharer
    );
    return selectedSharer;
  }
  selectedSharer.value.push(sharer);
};
const selectAll = () => {
  selectedSharer.value = [];
  sharers.value.forEach(sharer => {
    selectedSharer.value.push(sharer);
  });
};

const removeAll = () => {
  selectedSharer.value = [];
};

const deleteAllExpense = () => {
  expenseRecords.value = [];
  splitBill();
  saveData();
};

const sharerSelectorClass = sharer => {
  const isSelected = selectedSharer.value.find(selected => selected === sharer);
  return {
    "sharer-selector": true,
    "sharer-selector--selected": isSelected,
  };
};

const splitBill = () => {
  transferBook.value = billSplitter(sharers.value, expenseRecords.value);
};

const redirectToGitHub = () => {
  window.open("https://github.com/ostoc/bill-splitter");
};

const saveCloud = async () => {
  if (!secret.value) {
    await createRecord(expenseRecords.value, sharers.value).then(data => {
      secret.value = data.secret;
    });
    window.location.href = `${import.meta.env.VITE_BASE_URL}/?secret=${
      secret.value
    }`;
  }
  await updateRecord(secret.value, expenseRecords.value, sharers.value);
};

const deleteCloud = async () => {
  if (!secret.value) return;
  deleteRecord(secret.value);
  clearData();
};

const fetchCloud = async () => {
  if (!secret.value) return;

  const { data } = await fetchRecord(secret.value);
  if (data) {
    sharers.value = data.sharers;
    expenseRecords.value = data.records;
  } else {
    secret.value = "";
    window.location.href = import.meta.env.VITE_BASE_URL;
  }
};

const shareUrl = computed(() => {
  return secret.value ? generetUrl(secret.value) : "";
});

onMounted(() => {
  sharers.value = getLocalStorage("sharers");
  selectedSharer.value = getLocalStorage("sharers");
  expenseRecords.value = getLocalStorage("expenseRecords");
  secret.value = getSecret();
  fetchCloud();
  splitBill();
});
</script>
