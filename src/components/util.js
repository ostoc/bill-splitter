function formatCurrency(amount) {
  let value = amount;
  value = Math.round(value * 100);
  value = value / 100;
  return value;
}

export default formatCurrency;
