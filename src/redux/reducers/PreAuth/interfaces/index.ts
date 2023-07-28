export interface IPreAuthValues {
  preAuthRef: string;
  amount: number;
  surcharge: number;
  verified: boolean;
}

export const key = {
  UPDATE_MULTIPLE: 'updateMultiple',
  PRE_AUTH_REF: 'preAuthRef',
  AMOUNT: 'amount',
  SURCHARGE: 'surcharge',
};

export type IPreAuthAction =
  | {
      key: 'UPDATE_PRE_AUTH_REF';
      value: string;
    }
  | {
      key: 'UPDATE_AMOUNT';
      value: number;
    }
  | {
      key: 'UPDATE_SURCHARGE';
      value: number;
    }
  | {
      key: 'UPDATE_VERIFIED';
      value: boolean;
    }
  | {
      key: 'OPEN_PRE_AUTH';
      value: IPreAuthValues;
    }
  | {
      key: 'TOPUP_PRE_AUTH';
      value: number;
    }
  | {
      key: 'REDUCE_PRE_AUTH';
      value: number;
    }
  | {
      key: 'CANCEL_PRE_AUTH';
      value: undefined;
    }
  | {
      key: 'COMPLETE_PRE_AUTH';
      value: undefined;
    };
