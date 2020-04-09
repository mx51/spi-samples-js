import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Input } from '../Input';

function handleKeyPress(event: any) {
  if (event.key < '0' || event.key > '9') {
    alert('invalid input');
    event.preventDefault();
    return false;
  }
  return true;
}

function SurchargeModal(props: {
  show: boolean;
  handleClose: Function;
  handleApplySurcharge: Function;
  surcharge: number;
  setSurcharge: Function;
}) {
  const { show, handleClose, handleApplySurcharge, surcharge, setSurcharge } = props;

  function applySurcharge() {
    handleApplySurcharge(surcharge / 100);
    setSurcharge(0);
  }
  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Add Surcharge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          id="surcharge"
          name="surcharge"
          label="Surcharge Amount"
          type="number"
          min="0"
          onKeyPress={handleKeyPress}
          defaultValue={surcharge === 0 ? '' : surcharge.toString()}
          onChange={(e: any) => setSurcharge(Number.parseInt(e.target.value, 10))}
        />
        <p className="ml-2">Cents</p>
        <Button
          id="btnApplySurcharge"
          variant="primary"
          className="btn-custom primary-button"
          onClick={() => applySurcharge()}
          block
        >
          Apply
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export { SurchargeModal as default, handleKeyPress };
