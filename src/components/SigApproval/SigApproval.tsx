import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { transactionFlow as transactionFlowService } from '../../services';

function SigApproval(props: { show: any; handleClose: Function; spi: any; setShowSigApproval: Function }) {
  const { show, handleClose, spi, setShowSigApproval } = props;
  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Signature Approval Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="ml-2">Please confirm</p>
        <Button
          id="btnSigApproval"
          variant="primary"
          className="btn-custom"
          onClick={() => {
            transactionFlowService.acceptSignature(spi);
            setShowSigApproval(false);
          }}
          block
        >
          Approve
        </Button>
        <Button
          id="btnSigDecline"
          variant="primary"
          className="btn-custom"
          onClick={() => {
            transactionFlowService.declineSignature(spi);
            setShowSigApproval(false);
          }}
          block
        >
          Decline
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default SigApproval;
