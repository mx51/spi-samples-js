export interface IKeyPadProps {
  title: string;
  subtitle: string;
  defaultAmount: number;
  onAmountChange: (amount: number) => void;
  open: boolean;
  onClose: () => void;
}
