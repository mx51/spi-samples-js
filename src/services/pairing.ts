import { Spi } from '@mx51/spi-client-js';

// Pairing operations

function setUseSecureWebSockets(spi: Spi, isSecure: boolean) {
  spi.SetSecureWebSockets(isSecure);
}

function pair(spi: Spi) {
  spi.Pair();
}

function pairingConfirmCode(spi: Spi) {
  spi.PairingConfirmCode();
}

function pairingCancel(spi: Spi) {
  spi.PairingCancel();
}

function unpair(spi: Spi) {
  spi.Unpair();
}

// Handle paring events

function printPairingStatus(flowMsg: Logger, spi: Spi) {
  flowMsg.Info(`# --------------- STATUS ------------------`);
  flowMsg.Info(`# ${spi._posId} <-> Eftpos: ${spi._eftposAddress} #`);
  flowMsg.Info(`# SPI STATUS: ${spi.CurrentStatus}     FLOW: ${spi.CurrentFlow} #`);
  flowMsg.Info(`# SPI CONFIG: ${JSON.stringify((spi._spiPreauth && spi._spiPreauth.Config) || spi.Config)}`);
  flowMsg.Info(`# -----------------------------------------`);
  flowMsg.Info(`# POS: v${spi._posVersion} Spi: v${Spi.GetVersion()}`);
}

function handlePairingUpdate(flowMsg: Logger, pairingState: PairingFlowState) {
  flowMsg.Info(`### PAIRING PROCESS UPDATE ###`);
  flowMsg.Info(`# ${pairingState.Message}`);
  flowMsg.Info(`# Finished? ${pairingState.Finished}`);
  flowMsg.Info(`# Successful? ${pairingState.Successful}`);
  flowMsg.Info(`# Confirmation Code: ${pairingState.ConfirmationCode}`);
  flowMsg.Info(`# Waiting Confirm from Eftpos? ${pairingState.AwaitingCheckFromEftpos}`);
  flowMsg.Info(`# Waiting Confirm from POS? ${pairingState.AwaitingCheckFromPos}`);
}

export default {
  handlePairingUpdate,
  pair,
  pairingCancel,
  pairingConfirmCode,
  printPairingStatus,
  setUseSecureWebSockets,
  unpair,
};
