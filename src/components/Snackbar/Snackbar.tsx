import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectedPairError } from '../../redux/reducers/PairFormSlice/PairFormSelectors';
import { readTerminalPairError } from '../../redux/reducers/PairFormSlice/pairFormSlice';
import { ISnackbar } from './interfaces';

export default function SnackbarWrapper({
  duration = 10000,
  horizontal = 'center',
  vertical = 'bottom',
}: ISnackbar): React.ReactElement {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectedPairError);

  const handleClose = (): void => {
    dispatch(
      readTerminalPairError({
        isShown: false,
        message: '',
      })
    );
  };

  return error?.isShown ? (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={duration}
      key={vertical + horizontal}
      message={error?.message}
      open={error?.isShown}
      onClose={handleClose}
    />
  ) : (
    <span />
  );
}
