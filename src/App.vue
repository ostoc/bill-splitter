<template>
  <div id="app">
    <h2>Sharers</h2>
    <div class="sharer">
      <div class v-for="(sharer, index) in sharers" :key="index">
        <span v-text="sharer" />
        <span @click="removeSharer(sharer)">Delete</span>
      </div>
      <input v-model="newSharer" />
      <button @click="addSharer()">ADD</button>
    </div>
    <h2>Expense Records</h2>
    <div class="expense">
      <div class="row">
        <input type="number" v-model="amount" placeholder="Amount" />
        <button @click="addRecord">Add</button>
      </div>
      <div class="row">
        <div>Shared by</div>
        <div @click="selectAll()">Select All</div>
        <div @click="removeAll()">Remove All</div>
      </div>
      <div class="row">
        <div v-for="(sharer, index) in sharers" :key="index">
          <div
            :class="sharerSelectorClass(sharer)"
            @click="chooseSharer(sharer)"
          >
            {{ sharer.substring(0, 2) }}
          </div>
        </div>
      </div>
    </div>
    <div class="expense-list">
      <ul>
        <li v-for="(record, index) in expenseRecords" :key="index">
          {{ record.names }} {{ record.amount }}
          <button @click="removeRecord(expenseRecords, record)">Remove</button>
        </li>
      </ul>
    </div>

    <IndividualExpanseTable :data="individualExpanse" />

    <H2>Paid Records</H2>
    <select v-model="payer">
      <option v-for="(sharer, index) in sharers" :key="index" :value="sharer">{{
        sharer
      }}</option>
    </select>
    <input v-model="paidAmount" />
    <button @click="addPayRecord">Add</button>
    <ul>
      <li v-for="(paid, index) in paidRecords" :key="index">
        {{ paid.name }} - {{ paid.amount }}
        <button @click="removeRecord(paidRecords, paid)">Remove</button>
      </li>
    </ul>

    <ul>
      <li v-for="(trans, index) in transferBook" :key="index">
        {{ trans.to }} {{ trans.amount }}
      </li>
    </ul>

    <IndividualExpanseTable :data="individualBalance" />
    <button @click="cals">Cal</button>
  </div>
</template>

<script>
import IndividualExpanseTable from "@/components/IndividualExpanseTable";
export default {
  name: "app",
  data() {
    return {
      amount: null,
      selectedSharer: [],
      transferBook: [],
      recordTitle: null,
      newSharer: null,
      payer: null,
      paidAmount: null,
      sharers: ["Ben", "James", "Justin", "Junyu"],
      expenseRecords: [],
      paidRecords: []
    };
  },
  components: {
    IndividualExpanseTable
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
    },
    removeSharer(sharer) {
      this.sharers = this.sharers.filter(item => item !== sharer);
      this.expenseRecords.forEach(record => {
        record.names = record.names.filter(name => name !== sharer.name);
      });
      this.paidRecords = this.paidRecords.filter(record => {
        record.name !== sharer.name;
      });
    },
    addRecord() {
      const record = {
        names: [...this.selectedSharer],
        amount: this.amount
      };
      if (record.names.length === 0 || record.amount === null) {
        alert("You need select person or have amout");
        return;
      }
      this.expenseRecords.push(Object.create(record));
    },
    removeRecord(list, record) {
      list.splice(this.expenseRecords.indexOf(record), 1);
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
      this.transferBook = [];
      const dynamicBalanceBook = JSON.parse(
        JSON.stringify(this.individualBalance)
      );
      for (let i = 0; i < dynamicBalanceBook.length; i++) {
        this.cal(dynamicBalanceBook);
        if ([...dynamicBalanceBook].every(a => a.balance === 0)) {
          break;
        }
      }
    },
    cal(book) {
      const max = book.reduce(function(prev, current) {
        return prev.balance > current.balance ? prev : current;
      });
      const min = book.reduce(function(prev, current) {
        return prev.balance < current.balance ? prev : current;
      });
      const detal = max.balance + min.balance;
      const amount = Math.abs(Math.min(max.balance, min.balance));
      if (detal > 0) {
        max.balance = detal;
        min.balance = 0;
      } else {
        min.balance = detal;
        max.balance = 0;
      }
      this.transferBook.push({
        amount: amount,
        to: `${min.name} => ${max.name}`
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 16px;
}
.expense {
  background: #ddd;
  border: 1px solid #888;
  display: flex;
  padding: 8px;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex-direction: row;
}
.sharer-selector {
  height: 40px;
  width: 40px;
  display: flex;
  background: #999;
  border-radius: 100%;
  border: 1px solid #999;
  align-items: center;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
}
.sharer-selector:hover {
  cursor: pointer;
}
.sharer-selector--selected {
  background: green;
}
button {
  background: #3a740a;
  height: 40px;
  border: 0;
  border-radius: 4px;
  color: #fff;
  min-width: 80px;
}
input {
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
select {
  height: 40px;
  font-size: 16px;
}
</style>
