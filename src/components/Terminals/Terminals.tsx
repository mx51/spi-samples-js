import React from 'react';
import { Card, Button, Table, Badge } from 'react-bootstrap';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import Unpair from './Unpair';

import { addTerminal as addTerminalAction } from '../../features/terminals/terminalSlice';

const selectTerminals = (state: any) => state.terminals;
const selectActiveTerminals = createSelector(selectTerminals, (terminals) =>
  Object.entries(terminals)
    .filter((e) => e[0] !== 'activeTerminalId')
    .map((e) => e[1])
);

const mapStateToProps = (state: any) => ({
  terminals: selectActiveTerminals(state),
});

const mapDispatchToProps = {
  addTerminal: addTerminalAction,
};

function Terminals(props: any) {
  const { terminals, addTerminal } = props;

  console.log('props is ', terminals);

  return (
    <div className="mt-3">
      <Card>
        <Card.Header>
          <Button onClick={() => addTerminal()} className="float-right button btn-primary rounded-0">
            Pair new Terminal
          </Button>
        </Card.Header>
        <Table>
          <thead>
            <tr>
              <th>POS ID</th>
              <th>Pairing Status</th>
              <th>Connection Status</th>
              <th>EFTPOS IP Address</th>
              <th>Serial Number</th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {terminals && terminals.length > 0 ? (
              terminals.map((t: any) => (
                <tr key={t.terminalConfig.posId}>
                  <td>{t.terminalConfig.posId}</td>
                  <td>
                    <Badge pill variant="primary">
                      {t.status}
                    </Badge>
                  </td>
                  <td>{t.terminalStatus}</td>
                  <td>{t.terminalConfig.eftpos}</td>
                  <td>{t.terminalConfig.serialNumber}</td>
                  <td>
                    <Button className="btn-sm">Pair</Button>
                  </td>
                  <td>
                    <Button className="btn-sm">Remove</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No terminals paired.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
      <Unpair />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminals);
