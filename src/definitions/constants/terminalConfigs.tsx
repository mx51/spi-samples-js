import { ITerminalConfigurationConstants } from '../../components/TerminalsPage/TerminalDetails/interfaces';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';

export const terminalConfigurationsPartOne = (terminal: ITerminalProps): Array<ITerminalConfigurationConstants> => [
  {
    title: 'Merchant ID',
    content: `${terminal?.merchantId}`,
  },
  {
    title: 'Terminal ID',
    content: `${terminal?.terminalId}`,
  },
  {
    title: 'Serial number',
    content: `${terminal?.serialNumber}`,
  },
  {
    title: 'Battery',
    content: `${terminal?.batteryLevel}${terminal?.batteryLevel && terminal?.batteryLevel !== '-' ? '%' : ''}`,
  },
];

export const terminalConfigurationsPartTwo = (terminal: ITerminalProps): Array<ITerminalConfigurationConstants> => [
  {
    title: 'Payment provider',
    content: `${terminal?.acquirerCode}`,
  },
  {
    title: 'Configuration option',
    content: `${terminal?.autoAddress ? 'Yes' : 'No'}`,
  },
  {
    title: 'EFTPOS address',
    content: `${terminal?.deviceAddress}`,
  },
  {
    title: 'POS ID',
    content: `${terminal?.posId}`,
  },
];

export const payAtTableOptions = [
  {
    name: 'payAtTable',
    title: 'Pay at Table',
    subtitle: 'Enable Pay at Table for this terminal',
  },
  {
    name: 'splitBillEvenly',
    title: 'Split bill evenly',
    subtitle: 'Allow customers to split the bill equally',
  },
  {
    name: 'tipping',
    title: 'Tipping',
    subtitle: 'Allow customers to tip during a Pay at Table transaction',
  },
  {
    name: 'acceptCash',
    title: 'Accept cash',
    subtitle: 'Allow customers to pay by cash during a Pay at Table transaction',
  },
  {
    name: 'retrieveAllTables',
    title: 'Retrieve all tables',
    subtitle: 'Request a list of all open tables and sales from the POS',
  },
  {
    name: 'requireOperatorID',
    title: 'Require Operator ID',
    subtitle: 'Prompt for Operator ID in Pay at Table mode',
  },
  {
    name: 'transactionSummaryReport',
    title: 'Transaction summary report',
    subtitle: 'Print a summary at the end of a Pay at Table transaction',
  },
];

export const payAtTableFields = [
  {
    helperText: 'Customise the ‘Pay at Table’ button displayed on the terminal',
    id: 'payAtTableLabelField',
    label: 'Pay at Table label',
  },
  {
    helperText: 'Customise the ‘Operator ID’ field label displayed on the terminal',
    id: 'operatorIDField',
    label: 'Operator ID label',
  },
  {
    helperText: 'Customise the ‘Table’ field label displayed on the terminal',
    id: 'tableLabelField',
    label: 'Table label',
  },
];
