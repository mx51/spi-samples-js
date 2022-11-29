import spiService from '../../../services/spiService';

export function settlement(instanceId: string, posRefId: string): void {
  spiService.initTxSettlement(instanceId, posRefId);
}

export function settlementEnquiry(instanceId: string, posRefId: string): void {
  spiService.initTxSettlementEnquiry(instanceId, posRefId);
}

export function approveSignature(instanceId: string): void {
  spiService.signatureForApprove(instanceId);
}

export function declineSignature(instanceId: string): void {
  spiService.signatureForDecline(instanceId);
}

export function spiSetPromptForCustomerCopyOnEftpos(instanceId: string, value: boolean): void {
  spiService.spiSetPromptForCustomerCopyOnEftpos(instanceId, value);
}

export function spiHardwarePrinterAvailable(instanceId: string): boolean {
  return spiService.spiHardwarePrinterAvailable(instanceId);
}
