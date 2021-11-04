import { RootState } from '../../store';

const selectedShowFlowPanel = (state: RootState): boolean => state.common.showFlowPanel;

export default selectedShowFlowPanel;
