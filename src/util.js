export function formatCurrency(amount) {
  let value = amount;
  value = Math.round(value * 100);
  value = value / 100;
  return value.toFixed(2);
}

export function getLocalStorage(key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
}

export function totalAmount(records) {
  let total = 0;
  records.forEach(record => {
    total = total + record.amount;
  });
  return total.toFixed(2);
}

export function individualExpense(sharers, expenseRecords) {
  let localBalance = [];
  sharers.forEach(shareName => {
    localBalance.push({ name: shareName, balance: 0, spend: 0, paid: 0 });
  });
  expenseRecords.forEach(record => {
    const sharedAmount = record.amount / record.names.length;
    record.names.forEach(name => {
      let sharer = localBalance.find(item => item.name === name);
      sharer.spend = sharer.spend + sharedAmount;
    });
    let sharer = localBalance.find(item => item.name === record.paidBy);
    sharer.paid = sharer.paid + record.amount;
  });

  localBalance.map(item => {
    item.name, (item.balance = item.paid - item.spend);
  });

  return localBalance;
}

export function calulationDiffer(book) {
  const max = book.reduce(function (prev, current) {
    return prev.balance > current.balance ? prev : current;
  });
  const min = book.reduce(function (prev, current) {
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
  return {
    amount: amount,
    from: min.name,
    to: max.name,
    paid: false,
  };
}
export function billSplitter(sharers, expenseRecords) {
  const expense = individualExpense(sharers, expenseRecords);
  console.log(expense);
  let transferBook = [];
  for (let i = 0; i < expense.length; i++) {
    let record = calulationDiffer(expense);
    if (record.amount >= 0.01) {
      transferBook.push(record);
    }
    if ([...expense].every(a => a.balance === 0)) {
      break;
    }
  }
  return transferBook;
}

export function getSecret() {
  const url = new URL(window.location.href);
  return url.searchParams.get("secret");
}

const baseUrl = import.meta.env.VITE_BASE_URL;
export function generetUrl(secrect) {
  return `${baseUrl}/?secret=${secrect}`;
}
