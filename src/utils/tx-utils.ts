import { TransactionType } from '@mx51/spi-client-js';
import { messageEvents } from '../definitions/constants/commonConfigs';

export function getTxTypeByPosRefId(posRefId: string) {
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
