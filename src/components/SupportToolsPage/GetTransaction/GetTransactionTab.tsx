import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core';
import { CustomTab } from '../../CustomTab/CustomTab';
import { GetTransactionPanel } from './GetTransactionPanel';
import CustomContentPanel from '../../CustomContentPanel';
import PurchaseFlow from '../../PurchaseFlow';
import { selectHasPairedTerminals } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';
import NoTerminalPage from '../../NoTerminalPage';

export const GetTransactionTab: React.FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const classes = useStyles();
  const [receipt, setReceipt] = React.useState('');
  const [hasSearched, setHasSearched] = React.useState(false);
  // TODO: FE-20 - Add support for cloud pairing terminals here
  const isTerminalPaired: boolean = useSelector(selectHasPairedTerminals);

  const gridComponents = () => {
    if (hasSearched) {
      return [
        <CustomContentPanel title="Receipt" css={classes.receiptBoxWrapper}>
          <pre>{receipt}</pre>
        </CustomContentPanel>,
        <CustomContentPanel title="Flow" css={classes.receiptBoxWrapper}>
          {hasSearched && <PurchaseFlow />}
        </CustomContentPanel>,
      ];
    }
    return null;
  };

  return (
    <>
      {isTerminalPaired ? (
        <CustomTab
          index={1}
          title="Get transaction"
          subtitle="Retrieve status and receipts of a specified transaction"
          value={tabIndex}
          customGridPanel={gridComponents()}
        >
          <GetTransactionPanel setReceipt={setReceipt} hasSearched={hasSearched} setHasSearched={setHasSearched} />
        </CustomTab>
      ) : (
        <>
          {tabIndex === 1 ? (
            <Container className={classes.root} maxWidth="lg">
              <NoTerminalPage />
            </Container>
          ) : null}
        </>
      )}
    </>
  );
};
