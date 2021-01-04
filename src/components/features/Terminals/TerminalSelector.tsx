import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, ListGroup, Nav, Button } from 'react-bootstrap';
import { selectPairedTerminals } from '../../../features/terminals/terminalSelectors';

type Props = {
  onSelect: (id: string) => void;
  onClose: () => void;
  show: Boolean;
};

function TerminalSelector({ onSelect, onClose, show }: Props) {
  const terminals = useSelector(selectPairedTerminals);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select terminal</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {terminals.length === 0 && <div className="text-center py-4">No terminals paired</div>}
        {terminals.length > 0 && (
          <ListGroup variant="flush">
            {terminals.map((t: any) => (
              <ListGroup.Item
                key={t.id}
                action
                onClick={() => {
                  onSelect(t.id);
                }}
              >
                <h5>{t.terminalConfig.posId}</h5>
                <p>
                  IP address {t.terminalConfig.eftpos} S/N {t.terminalConfig.serialNumber}
                </p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer className="text-center small" style={{ display: 'block' }}>
        <p>Only showing active terminals.</p>
        <p>
          Can&apos;t find the terminal you&apos;re looking for?{' '}
          <Button variant="link" size="sm" onClick={() => document.getElementById('pos-tabs-tab-terminals')?.click()}>
            View Terminals
          </Button>
        </p>
      </Modal.Footer>
    </Modal>
  );
}

export default TerminalSelector;
