import React from 'react';
import './Status.css';
import { Alert } from 'react-bootstrap';
import { pairing as pairingService } from '../../services';

function Status(props: {
  isPaired: Boolean;
  onChangeStatus: Function;
  isAwaitingConfirmation: boolean;
  isFinishedPairing: boolean;
  spi: any;
}) {
  const { isPaired, onChangeStatus, isAwaitingConfirmation, isFinishedPairing, spi } = props;
  console.log('isAwaitingConfirmation', isAwaitingConfirmation);
  console.log('isFinishedPairing', isFinishedPairing);

  return (
    <div>
      <h2 className="sub-header">Status</h2>

      <div className="ml-3 mr-3">
        {isPaired ? (
          <Alert variant="success"> Paired Connected: Idle </Alert>
        ) : (
          <Alert variant="danger"> Unpaired : Idle </Alert>
        )}
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
            {!isFinishedPairing && (
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
