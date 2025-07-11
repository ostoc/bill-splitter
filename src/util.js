function round(value) {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(amount) {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

export function calculationDiffer(book) {
  const max = book.reduce((prev, curr) =>
    prev.balance > curr.balance ? prev : curr
  );
  const min = book.reduce((prev, curr) =>
    prev.balance < curr.balance ? prev : curr
  );

  const amount = Math.min(Math.abs(min.balance), Math.abs(max.balance));
  const roundedAmount = Math.round(amount * 100) / 100;

  // Settle this amount between max and min
  min.balance += roundedAmount;
  max.balance -= roundedAmount;

  min.balance = Math.round(min.balance * 100) / 100;
  max.balance = Math.round(max.balance * 100) / 100;

  return {
    amount: roundedAmount,
    from: min.name,
    to: max.name,
    paid: false,
  };
}
export function billSplitter(sharers, expenseRecords) {
  // Step 1: Calculate individual balances
  let balances = individualExpense(sharers, expenseRecords).map(e => ({
    name: e.name,
    balance: round(e.balance),
  }));

  // Guard: if less than 2 balances, nothing to split
  if (!balances.length || balances.length < 2) return [];

  const transferBook = [];

  // Step 2: Continue until all balances are close enough to zero
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
    transferBook.push({
      from: debtor.name,
      to: creditor.name,
      amount: amount,
      paid: false,
    });

    // Update balances
    debtor.balance = round(debtor.balance + amount);
    creditor.balance = round(creditor.balance - amount);
  }

  return transferBook;
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
