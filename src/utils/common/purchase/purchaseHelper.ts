import { TransactionType } from '@mx51/spi-client-js';
import { messageEvents } from '../../../definitions/constants/commonConfigs';
import spiService from '../../../services/spiService';

export function getTxTypeByPosRefId(posRefId: string): string {
  if (posRefId.includes(messageEvents.purchase)) {
    return TransactionType.Purchase;
  }
  if (posRefId.includes(messageEvents.moto)) {
    return TransactionType.MOTO;
  }
  if (posRefId.includes(messageEvents.cash)) {
    return 'Cashout';
  }
  if (posRefId.includes(messageEvents.refund)) {
    return TransactionType.Refund;
  }
  if (posRefId.includes(messageEvents.accountVerify)) {
    return 'Account Verified';
  }
  if (posRefId.includes(messageEvents.preauthTopup)) {
    return 'Preauth Topup';
  }
  if (posRefId.includes(messageEvents.preauthExtend)) {
    return 'Preauth Extend';
  }
  if (posRefId.includes(messageEvents.preauthPartialCancellation)) {
    return 'Preauth Reduce';
  }
  if (posRefId.includes(messageEvents.preauthCancellation)) {
    return 'Preauth Cancel';
  }
  if (posRefId.includes(messageEvents.preauthComplete)) {
    return 'Preauth Complete';
  }
  if (posRefId.includes(messageEvents.preauthOpen)) {
    return 'Preauth Open';
  }
  return '';
}
export function initiatePurchase(
  instanceId: string,
  purchaseAmount: number,
  tipAmount: number,
  cashoutAmount: number,
  surchargeAmount: number,
  promptForCashout: boolean
): void {
  const posRefId = `${messageEvents.purchase}-${new Date().toISOString()}`;
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
  const posRefId = `${messageEvents.moto}-${new Date().toISOString()}`;
  spiService.initiateMotoPurchaseTransaction(instanceId, posRefId, purchaseAmount, surchargeAmount);
}

export function initiateCashoutOnlyTx(instanceId: string, purchaseAmount: number, surchargeAmount: number): void {
  const posRefId = `${messageEvents.cash}-${new Date().toISOString()}`;
  spiService.initiateCashoutOnlyTxTransaction(instanceId, posRefId, purchaseAmount, surchargeAmount);
}

export function initiateRefundTx(instanceId: string, refundAmount: number): void {
  const posRefId = `${messageEvents.refund}-${new Date().toISOString()}`;
  spiService.initiateRefundTxTransaction(instanceId, posRefId, refundAmount);
}

export function InitiateAccountVerifyTx(instanceId: string): void {
  const posRefId = `${messageEvents.accountVerify}-${new Date().toISOString()}`;
  spiService.initiateAccountVerify(instanceId, posRefId);
}

export function InitiatePreAuthOpenTx(instanceId: string, preAuthAmount: number): void {
  const posRefId = `${messageEvents.preauthOpen}-${new Date().toISOString()}`;
  spiService.initiatePreAuthOpen(instanceId, posRefId, preAuthAmount);
}

export function InitiatePreAuthTopupTx(instanceId: string, preAuthAmount: number, preAuthId: string): void {
  const posRefId = `${messageEvents.preauthTopup}-${new Date().toISOString()}`;
  spiService.initiatePreAuthTopup(instanceId, posRefId, preAuthId, preAuthAmount);
}

export function InitiatePreAuthReduceTx(instanceId: string, preAuthAmount: number, preAuthId: string): void {
  const posRefId = `${messageEvents.preauthPartialCancellation}-${new Date().toISOString()}`;
  spiService.initiatePreAuthReduce(instanceId, posRefId, preAuthId, preAuthAmount);
}

export function InitiatePreAuthExtendTx(instanceId: string, preAuthId: string): void {
  const posRefId = `${messageEvents.preauthExtend}-${new Date().toISOString()}`;
  spiService.initiatePreAuthExtend(instanceId, posRefId, preAuthId);
}

export function InitiatePreAuthCompleteTx(
  instanceId: string,
  preAuthAmount: number,
  preAuthId: string,
  surchargeAmount: number
): void {
  const posRefId = `${messageEvents.preauthComplete}-${new Date().toISOString()}`;
  spiService.initiatePreAuthCompletion(instanceId, posRefId, preAuthId, preAuthAmount, surchargeAmount);
}

export function InitiatePreAuthCancelTx(instanceId: string, preAuthId: string): void {
  const posRefId = `${messageEvents.preauthCancellation}-${new Date().toISOString()}`;
  spiService.initiatePreAuthCancel(instanceId, posRefId, preAuthId);
}

export function cancelTransaction(instanceId: string): void {
  spiService.spiCancelTransaction(instanceId);
}

export function setTerminalToIdle(instanceId: string): void {
  spiService.spiSetTerminalToIdle(instanceId);
}
