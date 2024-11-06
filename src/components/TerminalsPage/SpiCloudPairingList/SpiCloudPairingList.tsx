import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useReducer } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './index.styles';
import { SpiCloudPairing } from '../../../redux/reducers/PairingSlice/interfaces';
import SpiCloudPairingActionMenu from './SpiCloudPairingActionMenu';
import {
  spiCloudPairingListReducer as reducer,
  spiCloudPairingListReducerInitialState as initialState,
} from './SpiCloudPairingListReducer';

function SpiCloudPairingList({ pairings }: { pairings: SpiCloudPairing[] }): React.ReactElement {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Typography variant="h3" className={classes.tableHeading}>
        SPI Cloud
      </Typography>
      <div className={classes.container}>
        <TableContainer component={Paper} elevation={0} className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pairing ID</TableCell>
                <TableCell colSpan={2}>TID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairings.map((pairing: SpiCloudPairing) => (
                <TableRow key={`pairing_${pairing.pairingId}`}>
                  <TableCell scope="row">
                    <span className={classes.pairingIcon} style={{ backgroundColor: pairing.hexCode }} />
                    {pairing.pairingId}
                  </TableCell>
                  <TableCell scope="row">{pairing.tid}</TableCell>
                  <TableCell>
                    <SpiCloudPairingActionMenu pairing={pairing} dispatch={dispatch} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {state.isLoading && (
          <div className={classes.overlay}>
            <CircularProgress />
          </div>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={state.showErrorSnackbar}
        onClose={() => dispatch({ type: 'errorComplete' })}
      >
        <Alert variant="filled" severity="error">
          An error has occurred.
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        open={state.showSuccessSnackbar}
        onClose={() => dispatch({ type: 'successComplete' })}
      >
        <Alert variant="filled" severity="success">
          Success
        </Alert>
      </Snackbar>
    </>
  );
}
export default SpiCloudPairingList;
