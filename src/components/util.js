export function formatCurrency(amount) {
  let value = amount;
  value = Math.round(value * 100);
  value = value / 100;
  return value.toFixed(2);
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
  };
}

export function getLocalStorage(key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
}

export function totalAmount(records) {
  let total = 0;
  records.forEach((record) => {
    total = parseFloat(total) + parseFloat(record.amount);
  });
  return total;
}
