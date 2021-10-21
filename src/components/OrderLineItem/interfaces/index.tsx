export interface IOrderLineItemProps {
  label: string;
  amount: number;
  onAdd: () => void;
  disabled: boolean;
  viewOnly: boolean;
}
