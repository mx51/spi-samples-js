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

export function InitiateAccountVerifyTx(instanceId: string): void {
  const posRefId = `account-verify-${new Date().toISOString()}`;
  spiService.initiateAccountVerify(instanceId, posRefId);
}

export function InitiatePreAuthOpenTx(instanceId: string, preAuthAmount: number): void {
  const posRefId = `preauth-open-${new Date().toISOString()}`;
  spiService.initiatePreAuthOpen(instanceId, posRefId, preAuthAmount);
}

export function InitiatePreAuthTopupTx(instanceId: string, preAuthAmount: number, preAuthId: string): void {
  const posRefId = `preauth-topup-${new Date().toISOString()}`;
  spiService.initiatePreAuthTopup(instanceId, posRefId, preAuthId, preAuthAmount);
}

export function InitiatePreAuthReduceTx(instanceId: string, preAuthAmount: number, preAuthId: string): void {
  const posRefId = `preauth-reduce-${new Date().toISOString()}`;
  spiService.initiatePreAuthReduce(instanceId, posRefId, preAuthId, preAuthAmount);
}

export function InitiatePreAuthExtendTx(instanceId: string, preAuthId: string): void {
  const posRefId = `preauth-extend-${new Date().toISOString()}`;
  spiService.initiatePreAuthExtend(instanceId, posRefId, preAuthId);
}

export function InitiatePreAuthCompleteTx(
  instanceId: string,
  preAuthAmount: number,
  preAuthId: string,
  surchargeAmount: number
): void {
  const posRefId = `preauth-complete-${new Date().toISOString()}`;
  spiService.initiatePreAuthCompletion(instanceId, posRefId, preAuthId, preAuthAmount, surchargeAmount);
}

export function InitiatePreAuthCancelTx(instanceId: string, preAuthId: string): void {
  const posRefId = `preauth-cancel-${new Date().toISOString()}`;
  spiService.initiatePreAuthCancel(instanceId, posRefId, preAuthId);
}

export function cancelTransaction(instanceId: string): void {
  spiService.spiCancelTransaction(instanceId);
}

export function setTerminalToIdle(instanceId: string): void {
  spiService.spiSetTerminalToIdle(instanceId);
}
