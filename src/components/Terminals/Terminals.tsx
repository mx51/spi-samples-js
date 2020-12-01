import React from 'react';
import { Card, Button, Table, Badge } from 'react-bootstrap';
import { createSelector } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import Unpair from './Unpair';
import Inprogress from './Inprogress';
import ConfirmCode from './ConfirmCode';

import {
  addTerminal as addTerminalAction,
  unpairTerminal as unpairTerminalAction,
  removeTerminal as removeTerminalAction,
} from '../../features/terminals/terminalSlice';
import TerminalList from './TerminalList';
import TerminalDetails from './TerminalDetails';

const selectTerminals = (state: any) => state.terminals;

const selectActiveTerminal = createSelector(selectTerminals, (terminals) =>
  terminals.activeTerminalId ? terminals[terminals.activeTerminalId] : null
);

const mapStateToProps = (state: any) => ({
  activeTerminal: selectActiveTerminal(state),
});

function Terminals(props: any) {
  const { activeTerminal } = props;

  console.log('Terminals props is ', activeTerminal);

  return !activeTerminal ? <TerminalList /> : <TerminalDetails terminal={activeTerminal} />;
}

export default connect(mapStateToProps, null)(Terminals);
