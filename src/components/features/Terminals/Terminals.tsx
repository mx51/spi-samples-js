import React from 'react';
import { useSelector } from 'react-redux';
import TerminalList from './TerminalList';
import TerminalDetails from './TerminalDetails';
import { selectActiveTerminal } from '../../../features/terminals/terminalSelectors';

function Terminals() {
  const activeTerminal = useSelector(selectActiveTerminal);

  return !activeTerminal ? <TerminalList /> : <TerminalDetails terminal={activeTerminal} />;
}

export default Terminals;
