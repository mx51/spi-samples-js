import { TEXT_STATUS_PAIRING } from '../../../definitions/constants/commonConfigs';
import { setPairStatus } from '../../../redux/reducers/pairSlice';
import { AppDispatch } from '../../../redux/store';

// pair button click event
function handlePairClick(dispatch: AppDispatch): void {
  dispatch(setPairStatus(TEXT_STATUS_PAIRING));
}

export default handlePairClick;
