import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function SigApproval(props: { show: boolean; handleClose: Function; handleApproveSig: Function }) {
  const { show, handleClose, handleApproveSig } = props;
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
            handleApproveSig(true);
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
            handleApproveSig(false);
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
