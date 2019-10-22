<template>
  <div id="app">
    <h2>Sharers</h2>
    <div class=" sharers">
      <div class="row mb-1">
        <div class=" sharer" v-for="(sharer, index) in sharers" :key="index">
          <span v-text="sharer" />
          <span @click="removeSharer(sharer)" class="sharer__delete-button"
            >X</span
          >
        </div>
      </div>
      <div class="row mb-1">
        <input
          v-model="newSharer"
          style="flex:5 1"
          placeholder="New share's name"
        />
        <button
          class="ml-1"
          @click="addSharer()"
          :disabled="!newSharer"
          style="flex:1 1"
        >
          ADD
        </button>
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
        <button
          style="flex: 1 1"
          class="ml-1"
          :disabled="!amount"
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

    <ExpanseTable :tableData="expenseRecords" @delete="deleteExpenseRecord" />
    <!-- <h2>Indiviadual Spend</h2>
    <IndividualExpanseTable :data="individualExpanse" /> -->

    <H2>Paid Records</H2>
    <div class="row">
      <select v-model="payer" style="flex: 2 1">
        <option value="" disabled selected>Payed by</option>
        <option
          v-for="(sharer, index) in sharers"
          :key="index"
          :value="sharer"
          v-text="sharer"
        />
      </select>

      <input
        class="ml-1"
        v-model="paidAmount"
        style="flex: 1 1"
        type="number"
        placeholder="Amount"
      />
      <button
        class="ml-1"
        style="flex: 1 1"
        :disabled="!paidAmount || payer === ''"
        @click="addPayRecord"
        v-text="'Add'"
      />
    </div>
    <PaidTable :tableData="paidRecords" @delete="removeRecord"></PaidTable>

    <button class="calculation" @click="cals">Calulate Shared Bill</button>
    <TransferTable :tableData="transferBook"></TransferTable>
  </div>
</template>

<script>
import ExpanseTable from "@/components/ExpenseTable";
import PaidTable from "@/components/PaidTable";
import TransferTable from "@/components/TransferTable";
import { calulationDiffer, totalAmount } from "@/components/util";
export default {
  name: "app",
  data() {
    return {
      amount: null,
      selectedSharer: [],
      transferBook: [],
      recordTitle: null,
      newSharer: null,
      payer: "",
      paidAmount: null,
      sharers: ["Ben", "James", "Justin", "Junyu"],
      expenseRecords: [],
      paidRecords: []
    };
  },
  components: {
    ExpanseTable,
    PaidTable,
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
      this.paidRecords.forEach(record => {
        let share = localBalance.find(item => item.name === record.name);
        share.balance = parseFloat(share.balance) + parseFloat(record.amount);
      });
      return localBalance;
    }
  },

  methods: {
    addSharer() {
      this.sharers.push(this.newSharer);
      this.newSharer = null;
    },
    removeSharer(sharer) {
      this.sharers = this.sharers.filter(item => item !== sharer);
      this.selectedSharer = this.selectedSharer.filter(item => item !== sharer);
      this.expenseRecords.forEach(record => {
        record.names = record.names.filter(name => name !== sharer.name);
      });
      this.paidRecords = this.paidRecords.filter(record => {
        record.name !== sharer.name;
      });
    },
    deleteExpenseRecord(index) {
      return this.expenseRecords.splice(index, 1);
    },
    addRecord() {
      let record = {
        title: this.recordTitle,
        names: [...this.selectedSharer],
        amount: this.amount
      };
      if (record.names.length === 0 || record.amount === null) {
        alert("You need select person or have amout");
        return;
      }
      this.expenseRecords.push(Object.create(record));
      this.recordTitle = "";
      this.amount = "";
    },
    removeRecord(index) {
      this.paidRecords.splice(index, 1);
    },
    addPayRecord() {
      const record = {
        name: this.payer,
        amount: this.paidAmount
      };
      if (record.name === null || record.amount === null) {
        alert("You need select person or have amout");
        return;
      }
      this.paidRecords.push(record);
      this.payer = "";
      this.paidAmount = "";
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
      const spendTotal = totalAmount(this.expenseRecords);
      const paidTotal = totalAmount(this.paidRecords);
      if (spendTotal !== paidTotal) {
        alert("Your spend and paid are not the same");
        return;
      }
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
    this.selectedSharer = [...this.sharers];
  }
};
</script>
