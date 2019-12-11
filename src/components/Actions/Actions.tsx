import React from 'react';
import { Form } from 'react-bootstrap';
import './Actions.css';

function Actions() {
  return (
    <div>
      <p className="actions-header">Actions </p>
      <div className="actions">
        <button type="button" className="actions-button">
          Print
        </button>
        <button type="button" className="actions-button">
          Save
        </button>
        <button type="button" className="actions-button">
          Terminal status
        </button>
      </div>
      <div className="actions-checkbox">
        <Form.Check type="checkbox" id="check-Print-merchant-copy" label="Print merchant copy" />
      </div>
      <div className="actions-receipts">
        <textarea placeholder="Receipt header" className="actions-textarea" />
        <br />
        <textarea placeholder="Receipt footer" className="actions-textarea" />
      </div>
    </div>
  );
}

export default Actions;
