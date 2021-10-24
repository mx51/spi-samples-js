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
  const res = spiService.initiatePurchaseTransaction(
    instanceId,
    posRefId,
    purchaseAmount,
    tipAmount,
    cashoutAmount,
    promptForCashout,
    surchargeAmount
  );
  console.log('res', res);
}

export function initiateMotoPurchase(instanceId: string, purchaseAmount: number, surchargeAmount: number): void {
  const posRefId = `moto-${new Date().toISOString()}`;
  const res = spiService.initiateMotoPurchaseTransaction(instanceId, posRefId, purchaseAmount, surchargeAmount);
  console.log('res', res);
}
