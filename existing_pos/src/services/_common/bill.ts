class Bill {
  BillId: string | null;
  TableId: string | null;
  OperatorId: string | null;
  Label: string | null;
  TotalAmount: number;
  OutstandingAmount: number;
  tippedAmount: number;
  SurchargeAmount: number;
  Locked: boolean;

  constructor() {
    this.BillId = null;
    this.TableId = null;
    this.OperatorId = null;
    this.Label = null;
    this.TotalAmount = 0;
    this.OutstandingAmount = 0;
    this.tippedAmount = 0;
    this.SurchargeAmount = 0;
    this.Locked = false;
  }

  toString() {
    return `
      ${this.BillId} - /
      Table:${this.TableId}
      Operator Id:${this.OperatorId}
      Label:${this.Label}
      Total:$${(this.TotalAmount / 100).toFixed(2)}
      Outstanding:$${(this.OutstandingAmount / 100).toFixed(2)}
      Tips:$${(this.tippedAmount / 100).toFixed(2)}
      Surcharge:$${(this.SurchargeAmount / 100).toFixed(2)}
      Locked:${this.Locked}`;
  }
}

export default Bill;
