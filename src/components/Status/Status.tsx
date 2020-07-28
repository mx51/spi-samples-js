import React from 'react';
import { SpiStatus } from '@mx51/spi-client-js';
import { Alert } from 'react-bootstrap';
import { pairing as pairingService } from '../../services';

function Status(props: { isFinishedPairing: Boolean; spi: Spi; status: string; Message: String; pairButton: Boolean }) {
  const { isFinishedPairing, spi, status, Message, pairButton } = props;

  let message = 'Unpaired';
  let alert: 'danger' | 'success' | 'warning' = 'danger';

  if (status === SpiStatus.PairedConnected && isFinishedPairing) {
    message = 'Paired connected';
    alert = 'success';
  } else if (status === SpiStatus.Unpaired && !isFinishedPairing) {
    message = `${Message}`;
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
        <Alert id="alertMessage" variant={alert}>
          {message}
        </Alert>
        {isFinishedPairing && (
          <>
            {status === SpiStatus.Unpaired ? (
              <button
                id="btnPair"
                type="button"
                className="primary-button"
                disabled={!pairButton}
                onClick={() => pairingService.pair(spi)}
              >
                Pair
              </button>
            ) : (
              <button
                id="btnUnpair"
                type="button"
                className="primary-button"
                onClick={() => pairingService.unpair(spi)}
              >
                Unpair
              </button>
            )}
          </>
        )}
        {status === SpiStatus.Unpaired && !isFinishedPairing && (
          <div>
            <button
              id="btnCancelPairing"
              type="button"
              className="primary-button"
              onClick={() => pairingService.pairingCancel(spi)}
            >
              Cancel Pairing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Status;
