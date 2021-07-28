import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import InputAdornment from '@material-ui/core/InputAdornment';
// interfaces
import { IErrorInputAdornment } from '../interfaces';

function ErrorInputAdornment({ isValid }: IErrorInputAdornment): React.ReactElement {
  return (
    <>
      {isValid ? (
        <InputAdornment position="end">
          <ErrorIcon color="error" />
        </InputAdornment>
      ) : (
        ''
      )}
    </>
  );
}

export default ErrorInputAdornment;
