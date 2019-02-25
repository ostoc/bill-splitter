<template>
  <div id="app">
    <ul>
      <li v-for="(trans, index) in transferBook" :key="index">
        {{ trans.to }} {{ trans.amount }}
      </li>
    </ul>
    <ul>
      <li v-for="(record, index) in balanceBook" :key="index">
        {{ record.name }} <input v-model="record.balance" />
      </li>
    </ul>
    {{ balanceBook }}
    <button @click="cals">Cal</button>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      transferBook: [],
      balanceBook: [
        {
          name: "Alice",
          balance: 12
        },
        {
          name: "Bob",
          balance: -21
        },
        {
          name: "Caro",
          balance: 21
        },
        {
          name: "David",
          balance: -12
        }
      ]
    };
  },
  methods: {
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
