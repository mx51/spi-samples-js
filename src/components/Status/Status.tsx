import React from 'react';
import { SpiStatus } from '@mx51/spi-client-js';
import { Alert } from 'react-bootstrap';
import { pairing as pairingService } from '../../services';

function Status(props: { isAwaitingConfirmation: Boolean; isFinishedPairing: Boolean; spi: any; status: string }) {
  const { isAwaitingConfirmation, isFinishedPairing, spi, status } = props;
  console.log('isAwaitingConfirmation', isAwaitingConfirmation);
  console.log('isFinishedPairing', isFinishedPairing);

  let message = 'Unpaired';
  let alert: 'danger' | 'success' | 'warning' = 'danger';

  if (status === SpiStatus.PairedConnected && isFinishedPairing) {
    message = 'Paired connected';
    alert = 'success';
  } else if (status === SpiStatus.Unpaired && !isFinishedPairing) {
    message = 'Pairing';
    alert = 'warning';
  } else if (status === SpiStatus.PairedConnecting) {
    message = 'Attempting to Connect';
    alert = 'warning';
  } else {
    message = 'Unpaired';
    alert = 'danger';
  }

  return (
    <div>
      <h2 className="sub-header">Status</h2>

      <div className="ml-3 mr-3">
        <Alert variant={alert}> {message} </Alert>
        {isFinishedPairing && (
          <>
            {status === SpiStatus.Unpaired ? (
              <button type="button" className="primary-button" onClick={() => pairingService.pair(spi)}>
                Pair
              </button>
            ) : (
              <button type="button" className="primary-button" onClick={() => pairingService.unpair(spi)}>
                Unpair
              </button>
            )}
          </>
        )}
        {status === SpiStatus.Unpaired && !isFinishedPairing && (
          <div>
            {/* {isAwaitingConfirmation && (
              // <button type="button" onClick={() => pairingService.pairingConfirmCode(spi)}>
              //   Confirm code
              // </button>
            )} */}
            <button type="button" className="primary-button" onClick={() => pairingService.pairingCancel(spi)}>
              Cancel Pairing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Status;
