import spiService from '../../../services/spiService';

export function initiatePurchase(
  instanceId: string,
  purchaseAmount: number,
  tipAmount: number,
  cashoutAmount: number,
  surchargeAmount: number,
  promptForCashout: boolean
): void {
  const posRefId = `purchase-${new Date().toISOString()}`;
  spiService.initiatePurchaseTransaction(
    instanceId,
    posRefId,
    purchaseAmount,
    tipAmount,
    cashoutAmount,
    promptForCashout,
    surchargeAmount
  );
}

export function initiateMotoPurchase(instanceId: string, purchaseAmount: number, surchargeAmount: number): void {
  const posRefId = `moto-${new Date().toISOString()}`;
  spiService.initiateMotoPurchaseTransaction(instanceId, posRefId, purchaseAmount, surchargeAmount);
}

export function initiateCashoutOnlyTx(instanceId: string, purchaseAmount: number, surchargeAmount: number): void {
  const posRefId = `cashout-${new Date().toISOString()}`;
  spiService.initiateCashoutOnlyTxTransaction(instanceId, posRefId, purchaseAmount, surchargeAmount);
}

export function initiateRefundTx(instanceId: string, refundAmount: number): void {
  const posRefId = `refund-${new Date().toISOString()}`;
  spiService.initiateRefundTxTransaction(instanceId, posRefId, refundAmount);
}
export function cancelTransaction(instanceId: string): void {
  spiService.spiCancelTransaction(instanceId);
}
