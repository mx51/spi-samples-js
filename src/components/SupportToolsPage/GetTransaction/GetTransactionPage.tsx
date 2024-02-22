import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core';
import { CustomTabPage } from '../../CustomTabPage/CustomTabPage';
import { GetTransactionPanel } from './GetTransactionPanel';
import CustomContentPanel from '../../CustomContentPanel';
import PurchaseFlow from '../../PurchaseFlow';
import { isPaired } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';
import NoTerminalPage from '../../NoTerminalPage';

export const GetTransactionPage: React.FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const classes = useStyles();
  const [receipt, setReceipt] = React.useState('');
  const [hasSearched, setHasSearched] = React.useState(false);
  const isTerminalPaired: boolean = useSelector(isPaired);

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
        <CustomTabPage
          index={1}
          title="Get transaction"
          subtitle="Retrieve status and receipts of a specified transaction"
          value={tabIndex}
          customGridPanel={gridComponents()}
        >
          <GetTransactionPanel setReceipt={setReceipt} hasSearched={hasSearched} setHasSearched={setHasSearched} />
        </CustomTabPage>
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
