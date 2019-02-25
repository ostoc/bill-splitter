<template>
  <div id="app">
    <h1>Expense Record</h1>
    <div>
      <div v-for="(sharer, index) in sharers" :key="index">
        <button @click="addSharer(sharer.name)">{{ sharer.name }}</button>
      </div>
      {{ selectedSharer }}
      <label>Amount</label>
      <input type="number" v-model="amount" />
      <button @click="addRecord">Add</button>
    </div>

    {{ indivalBook }}

    <ul>
      <li v-for="(record, index) in expensRecords" :key="index">
        {{ record.names }} {{ record.amount }}
        <button @click="removeRecord(record)">Remove</button>
      </li>
    </ul>
    {{ expensRecords }}
    <H2>Payed</H2>
    <select v-model="payer">
      <option
        v-for="(sharer, index) in sharers"
        :key="index"
        :value="sharer.name"
        >{{ sharer.name }}</option
      >
    </select>
    <input v-model="paidAmount" />
    <button @click="addPayRecord">Add</button>
    <ul>
      <li v-for="(paid, index) in paidRecods" :key="index">
        {{ paid.name }} - {{ paid.amount }}
      </li>
    </ul>

    <ul>
      <li v-for="(trans, index) in transferBook" :key="index">
        {{ trans.to }} {{ trans.amount }}
      </li>
    </ul>
    {{ newBalance }}
    <!-- {{ balanceFinnal }} -->
    <button @click="cals">Cal</button>
  </div>
</template>

<script>
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
      expensRecords: [],
      paidRecods: [],
      balanceBook: [
        {
          name: "Alice",
          balance: 0
        },
        {
          name: "Bob",
          balance: 0
        },
        {
          name: "Caro",
          balance: 0
        },
        {
          name: "David",
          balance: 0
        }
      ]
    };
  },
  computed: {
    newBalance() {
      this.sharers.forEach(share => {
        this.expensRecords.forEach(record => {
          if (record.names.includes(share.name)) {
            const sharedAmount = record.amount / record.names.length;
            share.balance = share.balance + sharedAmount;
          }
        });
      });
      return this.sharers;
    }
  },
  methods: {
    addRecord() {
      const record = {
        names: this.selectedSharer,
        amount: this.amount
      };
      this.expensRecords.push(Object.create(record));
    },
    removeRecord(record) {
      this.expensRecords.splice(this.expensRecords.indexOf(record), 1);
    },
    addPayRecord() {
      this.paidRecods.push({
        name: this.payer,
        amount: this.paidAmount
      });
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
      const dynamicBalanceBook = this.balanceBook.map(a =>
        Object.assign([], a)
      );
      for (let i = 0; i < this.balanceBook.length - 1; i++) {
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
