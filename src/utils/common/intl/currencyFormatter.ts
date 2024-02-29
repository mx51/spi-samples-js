export default function currencyFormat(amount: number): string {
  return Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', currencyDisplay: 'narrowSymbol' }).format(
    amount
  );
}
