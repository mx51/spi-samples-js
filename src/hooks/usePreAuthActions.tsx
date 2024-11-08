import { useDispatch } from 'react-redux';
import { ITxFlow } from '../redux/reducers/TerminalSlice/interfaces';
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
  handlePreAuthActions: () => void;
  handleKeypadUpdate: (keyPadAmound: number) => void;
  handleSurchargeUpdate: (surchageAmount: number, preAuthId: string) => void;
};

export const usePreAuthActions = (txFlow?: ITxFlow): IPreAuthActionsType => {
  const dispatch = useDispatch();

  const preAuthValues = {
    preAuth: {
      preAuthRef: txFlow?.response?.data?.preAuthId ?? '-',
      preAuthAmount: txFlow?.response?.data?.preAuthAmount ?? 0,
      topupAmount: txFlow?.response?.data?.topupAmount ?? 0,
      reduceAmount: txFlow?.response?.data?.reduceAmount ?? 0,
      surcharge: txFlow?.response?.data?.surchargeAmount ?? 0,
      verified: txFlow?.success === 'Success',
    },
  };

  const handlePreAuthActions = () => {
    const transactionType = txFlow?.response?.data?.transactionType;
    if (transactionType === 'PRE-AUTH') {
      dispatch(addPreAuth(preAuthValues));
    }

    if (transactionType === 'TOPUP') {
      dispatch(topupPreAuth(preAuthValues));
    }

    if (transactionType === 'CANCEL') {
      dispatch(reducePreAuth(preAuthValues));
    }

    if (transactionType === 'PRE-AUTH CANCEL') {
      dispatch(clearPreAuth(preAuthValues));
    }

    if (transactionType === 'PCOMP') {
      dispatch(clearPreAuth(preAuthValues));
    }
  };

  const handleKeypadUpdate = (keyPadAmount: number) => {
    dispatch(updateKeypadAmount(keyPadAmount));
  };

  const handleSurchargeUpdate = (surchargeAmount: number, preAuthRefId: string) => {
    preAuthValues.preAuth.preAuthRef = preAuthRefId;
    preAuthValues.preAuth.surcharge = surchargeAmount;
    dispatch(updatePreAuthSurcharge(preAuthValues));
  };

  return { handlePreAuthActions, preAuthValues, handleKeypadUpdate, handleSurchargeUpdate };
};
