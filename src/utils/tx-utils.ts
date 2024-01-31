import { TransactionType } from '@mx51/spi-client-js';
import { messageEvents } from '../definitions/constants/commonConfigs';
import { ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';

export function getAmountCentsByTxType(txType: string, response: ITxFlow['response']) {
  if (!response?.data) {
    return 0;
  }
  switch (txType) {
    case TransactionType.CashoutOnly:
      return response.data.bankCashAmount;
    case TransactionType.Refund:
      return response.data.refundAmount;
    case TransactionType.Preauth:
      return response.data.preAuthAmount;
    default:
      return response.data.purchaseAmount;
  }
}

// We use this util in a different way, if the display flag is true, we return the display name of the transaction type
// otherwise we return the transaction type itself
export function getTxTypeByPosRefId(posRefId: string, forDisplay = true) {
  if (posRefId.includes(messageEvents.purchase)) {
    return TransactionType.Purchase;
  }
  if (posRefId.includes(messageEvents.moto)) {
    return TransactionType.MOTO;
  }
  if (posRefId.includes(messageEvents.cash)) {
    return forDisplay ? 'Cashout' : TransactionType.CashoutOnly;
  }
  if (posRefId.includes(messageEvents.refund)) {
    return TransactionType.Refund;
  }
  if (posRefId.includes(messageEvents.accountVerify)) {
    return forDisplay ? 'Account Verified' : TransactionType.AccountVerify;
  }
  if (posRefId.includes(messageEvents.preauthTopup)) {
    return forDisplay ? 'Preauth Topup' : TransactionType.Preauth;
  }
  if (posRefId.includes(messageEvents.preauthExtend)) {
    return forDisplay ? 'Preauth Extend' : TransactionType.Preauth;
  }
  if (posRefId.includes(messageEvents.preauthPartialCancellation)) {
    return forDisplay ? 'Preauth Reduce' : TransactionType.Preauth;
  }
  if (posRefId.includes(messageEvents.preauthCancellation)) {
    return forDisplay ? 'Preauth Cancel' : TransactionType.Preauth;
  }
  if (posRefId.includes(messageEvents.preauthComplete)) {
    return forDisplay ? 'Preauth Complete' : TransactionType.Preauth;
  }
  if (posRefId.includes(messageEvents.preauthOpen)) {
    return forDisplay ? 'Preauth Open' : TransactionType.Preauth;
  }
  return '';
}
