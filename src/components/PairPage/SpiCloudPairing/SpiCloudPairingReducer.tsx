export interface PairingResponse {
  data: {
    confirmation_code: string;
    key_id: string;
    pairing_id: string;
    signing_secret_part_b: string;
    spi_cloud_api_base_url: string;
  };
}

export interface State {
  pairSuccess: boolean;
  pairingResponse: PairingResponse | undefined;
  showErrorSnackbar: boolean;
  isLoading: boolean;
  posNickname: string;
}

export type Action =
  | { type: 'success'; payload: { pairingResponse: PairingResponse; posNickname: string } }
  | { type: 'error' }
  | { type: 'loading' }
  | { type: 'errorComplete' }
  | { type: 'initial' };

export const initialState = {
  pairSuccess: false,
  isLoading: false,
  pairingResponse: undefined,
  showErrorSnackbar: false,
  showSuccessSnackbar: false,
  posNickname: '',
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'success':
      return {
        ...state,
        pairSuccess: true,
        isLoading: false,
        pairingResponse: action.payload.pairingResponse,
        posNickname: action.payload.posNickname,
      };
    case 'loading':
      return { ...state, isLoading: true };
    case 'error':
      return { ...state, showErrorSnackbar: true, isLoading: false };
    case 'errorComplete':
      return { ...state, showErrorSnackbar: false };
    case 'initial':
      return initialState;
    default:
      return state;
  }
}
