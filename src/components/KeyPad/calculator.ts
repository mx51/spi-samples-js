export default (amount: string, num: string): string => {
  switch (num) {
    case 'Backspace':
      if (amount.length === 1) return '0';
      return amount.substring(0, amount.length - 1);
    case '.':
      return amount.includes('.') ? amount : amount + num;
    default:
      if (amount === '0') return num;
      if (amount.includes('.') && amount.indexOf('.') === amount.length - 3) return amount;
      if (!amount.includes('.') && amount.length === 4) return amount;
      return amount + num;
  }
};
