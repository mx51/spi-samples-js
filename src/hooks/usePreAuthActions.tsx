import { useDispatch } from 'react-redux';
import { ITerminalProps } from '../redux/reducers/TerminalSlice/interfaces';
import {
  addPreAuth,
  clearPreAuth,
  reducePreAuth,
  topupPreAuth,
  updateKeypadAmount,
  updatePreAuthSurcharge,
} from '../redux/reducers/PreAuth/preAuthSlice';

type IPreAuthActionsType = {
  preAuthValues: Record<string, unknown>;
  handlePreAuthActions: (keyPadAmound?: number, surchageAmount?: number, preAuthId?: string) => void;
};

export const usePreAuthActions = (currentTerminal: ITerminalProps): IPreAuthActionsType => {
  const dispatch = useDispatch();

  const preAuthValues = {
    preAuth: {
      preAuthRef: currentTerminal?.txFlow?.response?.data?.preAuthId ?? '-',
      preAuthAmount: currentTerminal?.txFlow?.response?.data?.preAuthAmount ?? 0,
      topupAmount: currentTerminal?.txFlow?.response?.data?.topupAmount ?? 0,
      reduceAmount: currentTerminal?.txFlow?.response?.data?.reduceAmount ?? 0,
      surcharge: currentTerminal?.txFlow?.response?.data?.surchargeAmount ?? 0,
      verified: currentTerminal?.txFlow?.success === 'Success',
    },
  };

  const handlePreAuthActions = (keyPadAmount?: number, surchargeAmount?: number, preAuthRefId?: string) => {
    if (keyPadAmount) {
      dispatch(updateKeypadAmount(keyPadAmount));
    } else if (keyPadAmount === 0) {
      dispatch(updateKeypadAmount(0));
    } else if (surchargeAmount && preAuthRefId) {
      preAuthValues.preAuth.preAuthRef = preAuthRefId;
      preAuthValues.preAuth.surcharge = surchargeAmount;
      dispatch(updatePreAuthSurcharge(preAuthValues));
    } else {
      if (currentTerminal?.txFlow?.response?.data?.transactionType === 'PRE-AUTH') {
        dispatch(addPreAuth(preAuthValues));
      }

      if (currentTerminal?.txFlow?.response?.data?.transactionType === 'TOPUP') {
        dispatch(topupPreAuth(preAuthValues));
      }

      if (currentTerminal?.txFlow?.response?.data?.transactionType === 'CANCEL') {
        dispatch(reducePreAuth(preAuthValues));
      }

      if (currentTerminal?.txFlow?.response?.data?.transactionType === 'PRE-AUTH CANCEL') {
        dispatch(clearPreAuth(preAuthValues));
      }

      if (currentTerminal?.txFlow?.response?.data?.transactionType === 'PCOMP') {
        dispatch(clearPreAuth(preAuthValues));
      }
    }
  };

  return { handlePreAuthActions, preAuthValues };
};
