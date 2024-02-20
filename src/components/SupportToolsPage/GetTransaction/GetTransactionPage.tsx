import React from 'react';
import { useSelector } from 'react-redux';
import { CustomTabPanel } from '../CustomTab/CustomTabPanel';
import { GetTransactionPanel } from './GetTransactionPanel';
import ReceiptPanel from '../../ReceiptPanel';
import PurchaseFlow from '../../PurchaseFlow';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import selectedTerminalIdSelector from '../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import useStyles from './index.styles';

export const GetTransactionPage: React.FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const classes = useStyles();
  const [receipt, setReceipt] = React.useState('');
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  console.log('currentTerminal', currentTerminal);

  return (
    <CustomTabPanel
      index={1}
      title="Get transaction"
      subtitle="Retrieve status and receipts of a specified transaction"
      value={tabIndex}
      customGridComponents={[
        <ReceiptPanel title="Receipt" css={classes.receiptBoxWrapper}>
          <pre>{receipt}</pre>
        </ReceiptPanel>,
        // convert to generic "customPanel" component
        <ReceiptPanel title="Flow" css={classes.receiptBoxWrapper}>
          <PurchaseFlow />
        </ReceiptPanel>,
      ]}
    >
      <GetTransactionPanel setReceipt={setReceipt} />
    </CustomTabPanel>
  );
};
