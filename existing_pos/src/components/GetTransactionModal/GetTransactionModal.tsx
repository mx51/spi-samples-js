import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Input } from '../Input';

function GetTransactionModal(props: {
  show: Boolean;
  handleClose: Function;
  handleGetTransaction: Function;
  posRefId: string;
  setPosRefId: Function;
}) {
  const { show, handleClose, handleGetTransaction, posRefId, setPosRefId } = props;

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Get Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          id="posRefId"
          name="posRefId"
          label="POS Reference"
          value={posRefId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosRefId(e.target.value)}
        />
        <Button
          id="btnGetTransaction"
          variant="primary"
          className="btn-custom primary-button"
          onClick={() => handleGetTransaction(posRefId, setPosRefId)}
          block
        >
          Get Transaction
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export { GetTransactionModal as default };
