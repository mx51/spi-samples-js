import spiService from '../../../services/spiService';

export function settlement(instanceId: string, posRefId: string): void {
  spiService.initTxSettlement(instanceId, posRefId);
}

export function settlementEnquiry(instanceId: string, posRefId: string): void {
  spiService.initTxSettlementEnquiry(instanceId, posRefId);
}
