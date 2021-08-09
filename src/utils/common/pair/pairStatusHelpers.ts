import { SPI_PAIR_FLOW } from '../../../definitions/constants/commonConfigs';
import { setPairStatus } from '../../../redux/reducers/pairSlice';
import { AppDispatch } from '../../../redux/store';

// pair button click event
function handlePairClick(dispatch: AppDispatch): void {
  dispatch(setPairStatus(SPI_PAIR_FLOW.PAIRING));
}

export default handlePairClick;
