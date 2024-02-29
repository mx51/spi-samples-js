export interface IOrderProps {
  disablePayNow: boolean;
  isSubtotalEditable: boolean;
  bottomButton: 'payNow' | 'amendOrder' | 'cancelSplit';
}
