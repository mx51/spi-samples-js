import currencyFormat from './intl/currencyFormatter';

// eslint-disable-next-line import/prefer-default-export
export function serialNumberFormatter(currentSerialNumber: string): string {
  let formatSerialNumber = currentSerialNumber.slice(0, 11).replaceAll('-', '');

  if (formatSerialNumber.length > 3 && formatSerialNumber.length <= 6)
    formatSerialNumber = `${formatSerialNumber.slice(0, 3)}-${formatSerialNumber.slice(3)}`;
  else if (currentSerialNumber.length > 6)
    formatSerialNumber = `${formatSerialNumber.slice(0, 3)}-${formatSerialNumber.slice(
      3,
      6
    )}-${formatSerialNumber.slice(6)}`;

  return formatSerialNumber;
}

type CurrentTX = {
  amountCents: number;
  surchargeAmount: number;
  bankCashAmount: number;
  tipAmount: number;
  preAuthAmount?: number;
};

export const calculateTotalAmount = (currentTransaction: CurrentTX): number => {
  const { amountCents, surchargeAmount, bankCashAmount, tipAmount } = currentTransaction;
  const totalAmount = amountCents + (surchargeAmount ?? 0) + (bankCashAmount ?? 0) + (tipAmount ?? 0);

  return totalAmount;
};

export const calculateCashoutOnlyTotalAmount = (currentTransaction: CurrentTX): number => {
  const { amountCents, surchargeAmount } = currentTransaction;
  const totalAmount = amountCents + (surchargeAmount ?? 0);

  return totalAmount;
};
