export interface IKeyPadProps {
  title: string;
  defaultAmount: number;
  onAmountChange: (amount: number) => void;
  open: boolean;
  onClose: () => void;
}
