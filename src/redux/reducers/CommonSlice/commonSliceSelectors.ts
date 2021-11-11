import { RootState } from '../../store';

export const selectedShowFlowPanel = (state: RootState): boolean => state.common.showFlowPanel;

export const selectedAcquireConfirmPairingFlow = (state: RootState): boolean => state.common.acquireConfirmPairingFlow;
