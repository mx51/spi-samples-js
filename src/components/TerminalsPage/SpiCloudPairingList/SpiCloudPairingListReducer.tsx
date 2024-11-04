export interface SpiCloudPairingListReducerState {
  showErrorSnackbar: boolean;
  showSuccessSnackbar: boolean;
  isLoading: boolean;
}

export type SpiCloudPairingListReducerActions =
  | { type: 'success' }
  | { type: 'successComplete' }
  | { type: 'error' }
  | { type: 'errorComplete' }
  | { type: 'loading' };

export const spiCloudPairingListReducerInitialState = {
  showErrorSnackbar: false,
  showSuccessSnackbar: false,
  isLoading: false,
};

export function spiCloudPairingListReducer(
  state: SpiCloudPairingListReducerState,
  action: SpiCloudPairingListReducerActions
) {
  switch (action.type) {
    case 'success':
      return { ...state, showSuccessSnackbar: true, isLoading: false };
    case 'loading':
      return { ...state, isLoading: true };
    case 'error':
      return { ...state, showErrorSnackbar: true, isLoading: false };
    case 'errorComplete':
      return { ...state, showErrorSnackbar: false };
    case 'successComplete':
      return { ...state, showSuccessSnackbar: false };
    default:
      return state;
  }
}
