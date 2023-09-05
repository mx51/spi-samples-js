export interface Props {
  index: number;
  subtitle: string;
  title: string;
  value: number;
}

export type ReceiptConfigKey =
  | 'eftposMerchantCopy'
  | 'eftposCustomerCopy'
  | 'eftposSignatureFlow'
  | 'suppressMerchantPassword'
  | 'receiptHeader'
  | 'receiptFooter';

export type ReceiptConfig = {
  [key in ReceiptConfigKey]: boolean | string;
};
