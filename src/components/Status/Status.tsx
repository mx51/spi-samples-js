import React from 'react';
import './Status.css';
import { Alert } from 'react-bootstrap';
import { pairing as pairingService } from '../../services';

function Status(props: {
  isPaired: Boolean;
  onChangeStatus: Function;
  isAwaitingConfirmation: Boolean;
  isFinishedPairing: Boolean;
  spi: any;
}) {
  const { isPaired, onChangeStatus, isAwaitingConfirmation, isFinishedPairing, spi } = props;
  console.log('isAwaitingConfirmation', isAwaitingConfirmation);
  console.log('isFinishedPairing', isFinishedPairing);
  console.log('isPaired', isPaired);

  let message = 'Unpaired';
  let alert: 'danger' | 'success' | 'warning' = 'danger';

  if (isPaired && isFinishedPairing) {
    message = 'Paired connected';
    alert = 'success';
  } else if (isPaired && !isFinishedPairing) {
    message = 'Pairing';
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

        {isPaired ? (
          <button type="button" onClick={() => onChangeStatus(false)}>
            Unpair
          </button>
        ) : (
          <button type="button" onClick={() => onChangeStatus(true)}>
            Pair
          </button>
        )}
        {isPaired && !isFinishedPairing && (
          <div>
            {isAwaitingConfirmation && (
              <button type="button" onClick={() => pairingService.pairingConfirmCode(spi)}>
                Confirm code
              </button>
            )}
            {isPaired && (
              <button type="button" onClick={() => pairingService.pairingCancel(spi)}>
                Cancel Pairing
              </button>
            )}
          </div>
          // {pairingState.Finished && <button type="button">Ok</button>}
        )}
      </div>
    </div>
  );
}

export default Status;
