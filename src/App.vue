<template>
  <div id="app">
    <h2>Sharers</h2>
    <div class=" sharers">
      <div class="row mb-1">
        <div class=" sharer" v-for="(sharer, index) in sharers" :key="index">
          <span v-text="sharer" />
          <span
            @click="removeSharer(sharer)"
            class="sharer__delete-button"
            v-text="'x'"
          />
        </div>
      </div>
      <div class="row mb-1">
        <input
          v-model="newSharer"
          style="flex:5 1"
          placeholder="New share's name"
          @keyup.enter="addSharer()"
        />
        <button
          class="ml-1"
          @click="addSharer()"
          :disabled="!newSharer"
          style="flex:1 1"
          v-text="'Add'"
        />
      </div>
    </div>

    <h2>Expense Records</h2>
    <div class="expense">
      <div class="row mb-1">
        <input v-model="recordTitle" placeholder="Title" style="flex: 2 1" />
        <input
          style="flex: 1 1"
          class="ml-1"
          type="number"
          v-model="amount"
          placeholder="Amount"
        />
        <select v-model="paidBy" class="ml-1" style="flex: 2 1">
          <option value="" disabled selected>Selecte paid by</option>
          <option
            v-for="(sharer, index) in sharers"
            :key="index"
            :value="sharer"
            v-text="sharer"
          />
        </select>
        <button
          style="flex: 1 1"
          class="ml-1"
          :disabled="!amount || !recordTitle || paidBy === ''"
          @click="addRecord"
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

    <ExpanseTable
      :tableData="expenseRecords"
      @delete="deleteExpenseRecord"
      @deleteAll="deleteAllExpenseRecord"
    />

    <button class="calculation" @click="cals">Calulate Shared Bill</button>
    <TransferTable :tableData="transferBook"></TransferTable>
    <button class="secondary" @click="clearData">Clear All Data</button>
  </div>
</template>

<script>
import ExpanseTable from "@/components/ExpenseTable";
import TransferTable from "@/components/TransferTable";
import { calulationDiffer, getLocalStorage } from "@/components/util";
export default {
  name: "app",
  data() {
    return {
      amount: null,
      selectedSharer: [],
      transferBook: [],
      recordTitle: null,
      newSharer: null,
      paidBy: "",
      sharers: [],
      expenseRecords: []
    };
  },
  components: {
    ExpanseTable,
    TransferTable
  },
  computed: {
    individualExpanse() {
      let localBalance = [];
      this.sharers.forEach(shareName => {
        localBalance.push({ name: shareName, balance: 0 });
      });
      this.expenseRecords.forEach(record => {
        const sharedAmount = record.amount / record.names.length;
        record.names.forEach(name => {
          let share = localBalance.find(item => item.name === name);
          share.balance = parseFloat(share.balance) + parseFloat(sharedAmount);
        });
      });
      return localBalance;
    },
    individualBalance() {
      const localBalance = JSON.parse(JSON.stringify(this.individualExpanse));
      localBalance.map(item => {
        item.name, (item.balance = -parseFloat(item.balance));
      });
      this.expenseRecords.forEach(record => {
        let share = localBalance.find(item => item.name === record.paidBy);
        share.balance = parseFloat(share.balance) + parseFloat(record.amount);
      });
      return localBalance;
    }
  },

  methods: {
    clearData() {
      this.sharers.length = 0;
      this.expenseRecords = 0;
      localStorage.clear();
    },
    saveData() {
      localStorage.setItem("sharers", JSON.stringify(this.sharers));
      localStorage.setItem(
        "expenseRecords",
        JSON.stringify(this.expenseRecords)
      );
    },
    addSharer() {
      if (this.sharers.includes(this.newSharer)) {
        alert(`${this.newSharer} is already in the list`);
        return;
      }
      this.sharers.push(this.newSharer);
      this.saveData();
      this.newSharer = null;
    },
    removeSharer(sharer) {
      this.sharers = this.sharers.filter(item => item !== sharer);
      this.selectedSharer = this.selectedSharer.filter(item => item !== sharer);
      this.expenseRecords.forEach(record => {
        record.names = record.names.filter(name => name !== sharer);
      });
      this.expenseRecords = this.expenseRecords.filter(
        item => item.paidBy !== sharer
      );
      this.saveData();
    },
    deleteExpenseRecord(index) {
      this.expenseRecords.splice(index, 1);
      this.saveData();
    },
    addRecord() {
      let record = {
        title: this.recordTitle,
        names: [...this.selectedSharer],
        amount: this.amount,
        paidBy: this.paidBy
      };
      if (record.names.length === 0 || record.amount === null) {
        alert("You need select person or have amout");
        return;
      }
      this.expenseRecords.push(record);
      this.saveData();
      this.recordTitle = "";
      this.amount = "";
    },
    chooseSharer(sharer) {
      if (this.selectedSharer.includes(sharer)) {
        this.selectedSharer = this.selectedSharer.filter(
          selected => selected !== sharer
        );
        return this.selectedSharer;
      }
      this.selectedSharer.push(sharer);
    },
    selectAll() {
      this.selectedSharer = [];
      this.sharers.forEach(sharer => {
        this.selectedSharer.push(sharer);
      });
    },
    removeAll() {
      this.selectedSharer = [];
    },
    deleteAllExpenseRecord() {
      this.expenseRecords = [];
      this.saveData();
    },
    sharerSelectorClass(sharer) {
      const isSelected = this.selectedSharer.find(
        selected => selected === sharer
      );
      return {
        "sharer-selector": true,
        "sharer-selector--selected": isSelected
      };
    },
    cals() {
      this.transferBook = [];
      const dynamicBalanceBook = JSON.parse(
        JSON.stringify(this.individualBalance)
      );
      for (let i = 0; i < dynamicBalanceBook.length; i++) {
        let record = calulationDiffer(dynamicBalanceBook);
        if (record.amount >= 0.01) {
          this.transferBook.push(record);
        }
        if ([...dynamicBalanceBook].every(a => a.balance === 0)) {
          break;
        }
      }
    }
  },
  created() {
    this.sharers = getLocalStorage("sharers");
    this.selectedSharer = getLocalStorage("sharers");
    this.expenseRecords = getLocalStorage("expenseRecords");
  }
};
</script>
