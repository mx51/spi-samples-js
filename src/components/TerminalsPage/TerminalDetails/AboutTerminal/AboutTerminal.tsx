import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { SpiStatus } from '@mx51/spi-client-js';
import { PATH_PAIR } from '../../../../definitions/constants/routerConfigs';
import {
  terminalConfigurationsPartOne,
  terminalConfigurationsPartTwo,
} from '../../../../definitions/constants/terminalConfigs';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { terminalPosRefId } from '../../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { handleUnPairClick } from '../../../../utils/common/pair/pairStatusHelpers';
import { settlement, settlementEnquiry } from '../../../../utils/common/terminal/terminalHelpers';
import { IAboutTerminal } from '../interfaces';
import useStyles from './index.styles';
import StatusBox from './StatusBox';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';

export default function AboutTerminal({
  receiptToggle,
  setReceiptToggle,
  terminal,
}: IAboutTerminal): React.ReactElement {
  const dispatch = useAppDispatch();
  const posRefId = useAppSelector(terminalPosRefId(terminal.id));
  const classes = useStyles();

  const handleSettlementDisplay = () => {
    setReceiptToggle({
      settlement: !receiptToggle.settlement,
      settlementEnquiry: false, // ensure settlementEnquiry panel is closed when settlement panel is opened or closed
    });

    if (!receiptToggle.settlement) settlement(terminal.id, posRefId as string);
  };

  const handleSettlementEnquiryDisplay = () => {
    setReceiptToggle({
      settlement: false, // ensure settlement panel is closed when settlementEnquiry panel is opened or closed
      settlementEnquiry: !receiptToggle.settlementEnquiry,
    });

    if (!receiptToggle.settlementEnquiry) settlementEnquiry(terminal.id, posRefId as string);
  };

  return (
    <>
      <Grid container>
        <Grid item className={(classes.fullWidth, classes.sectionSpacing)}>
          <Typography variant="h6" component="h1">
            Terminal information
          </Typography>
          <Typography className={classes.text}>Information about this terminal</Typography>
          <Grid container className={classes.detailRow}>
            <Grid item md={4} xs={12}>
              <Typography>Pairing status</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <StatusBox status={terminal?.status} />
              {terminal.status === SpiStatus.PairedConnected && (
                <>
                  <Button
                    className={classes.actionButton}
                    data-test-id="terminalDetailsSettlementBtn"
                    onClick={handleSettlementDisplay}
                  >
                    Settlement
                  </Button>
                  <Button
                    className={classes.actionButton}
                    data-test-id="terminalDetailsSettlementEnquiryBtn"
                    onClick={handleSettlementEnquiryDisplay}
                  >
                    Settlement enquiry
                  </Button>
                </>
              )}
              {[SpiStatus.PairedConnected, SpiStatus.PairedConnecting].includes(terminal.status) && (
                <Button
                  className={classes.actionButton}
                  data-test-id="terminalDetailsUnpairBtn"
                  onClick={() => handleUnPairClick(dispatch, terminal.id)}
                >
                  Unpair terminal
                </Button>
              )}
              {terminal.status === SpiStatus.Unpaired && (
                <Button
                  className={classes.actionButton}
                  component={Link}
                  data-test-id="terminalDetailsPairBtn"
                  to={`${PATH_PAIR}/${terminal.serialNumber}`}
                >
                  Pair terminal
                </Button>
              )}
            </Grid>
          </Grid>
          {terminalConfigurationsPartOne(terminal).map(({ title, content }) => (
            <Grid className={classes.detailRow} container key={title}>
              <Grid item md={4} xs={12}>
                <Typography>{title}</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Typography className={classes.text}>{content}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item className={(classes.fullWidth, classes.sectionSpacing)}>
          <Typography variant="h6" component="h1">
            Pairing configuration
          </Typography>
          {terminal?.status === SPI_PAIR_STATUS.Unpaired ? (
            ''
          ) : (
            <Typography className={classes.text}>
              To update the Pairing configuration you need to unpair this terminal using the Unpair button above
            </Typography>
          )}
          {terminalConfigurationsPartTwo(terminal).map(({ title, content }) => (
            <Grid className={classes.detailRow} container key={title}>
              <Grid item md={4} xs={12}>
                <Typography>{title}</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Typography className={classes.text}>{content}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
