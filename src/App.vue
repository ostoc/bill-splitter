<template>
  <div id="app">
    <h2>Expense Records</h2>
    <div>
      <div v-for="(sharer, index) in sharers" :key="index">
        <button @click="addSharer(sharer.name)">{{ sharer.name }}</button>
      </div>
      {{ selectedSharer }}
      <label>Amount</label>
      <input type="number" v-model="amount">
      <button @click="addRecord">Add</button>
    </div>
    <ul>
      <li v-for="(record, index) in expenseRecords" :key="index">
        {{ record.names }} {{ record.amount }}
        <button
          @click="removeRecord(expenseRecords,record)"
        >Remove</button>
      </li>
    </ul>

    <IndividualExpanseTable :data="individualExpanse"/>

    <H2>Paid Records</H2>
    <select v-model="payer">
      <option v-for="(sharer, index) in sharers" :key="index" :value="sharer.name">{{ sharer.name }}</option>
    </select>
    <input v-model="paidAmount">
    <button @click="addPayRecord">Add</button>
    <ul>
      <li v-for="(paid, index) in paidRecods" :key="index">
        {{ paid.name }} - {{ paid.amount }}
        <button @click="removeRecord(paidRecods,paid)">Remove</button>
      </li>
    </ul>

    <ul>
      <li v-for="(trans, index) in transferBook" :key="index">{{ trans.to }} {{ trans.amount }}</li>
    </ul>

    <IndividualExpanseTable :data="individualBalance"/>
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
      payer: null,
      paidAmount: null,
      sharers: [
        { name: "Alice", balance: 0 },
        { name: "Bob", balance: 0 },
        { name: "Caro", balance: 0 },
        { name: "David", balance: 0 }
      ],
      expenseRecords: [],
      paidRecods: []
    };
  },
  components: {
    IndividualExpanseTable
  },
  computed: {
    individualExpanse() {
      let localBalance = JSON.parse(JSON.stringify(this.sharers));
      this.expenseRecords.forEach(record => {
        const sharedAmount = record.amount / record.names.length;
        record.names.forEach(name => {
          let share = localBalance.find(item => item.name === name);
          share.balance = share.balance + sharedAmount;
        });
      });
      return localBalance;
    },
    individualBalance() {
      const localBalance = JSON.parse(JSON.stringify(this.individualExpanse));
      localBalance.map(item => {
        item.name, (item.balance = -parseFloat(item.balance));
      });
      this.paidRecods.forEach(record => {
        let share = localBalance.find(item => item.name === record.name);
        share.balance = parseFloat(share.balance) + parseFloat(record.amount);
      });
      return localBalance;
    }
  },

  methods: {
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
      this.paidRecods.push(record);
    },
    addSharer(sharer) {
      if (this.selectedSharer.includes(sharer)) {
        this.selectedSharer = this.selectedSharer.filter(
          selected => selected !== sharer
        );
        return this.selectedSharer;
      }
      this.selectedSharer.push(sharer);
    },
    cals() {
      const dynamicBalanceBook = this.individualBalance.map(a =>
        Object.assign([], a)
      );
      for (let i = 0; i < dynamicBalanceBook.length - 1; i++) {
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
