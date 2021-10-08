import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  terminalConfigurationsPartOne,
  terminalConfigurationsPartTwo,
} from '../../../../definitions/constants/terminalConfigs';
import { useAppDispatch } from '../../../../redux/hooks';
import { handleUnPairClick } from '../../../../utils/common/pair/pairStatusHelpers';
import useStyles from './index.styles';
import StatusBox from './StatusBox';

export default function AboutTerminal({ receiptToggle, setReceiptToggle, terminal }: Any): React.ReactElement {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const handleReceiptPanelDisplay = () => {
    setReceiptToggle(!receiptToggle);
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
              {StatusBox(classes, terminal?.status)}
              <Button className={classes.actionButton} onClick={handleReceiptPanelDisplay}>
                Settlement
              </Button>
              <Button className={classes.actionButton} onClick={handleReceiptPanelDisplay}>
                Settlement enquiry
              </Button>
              <Button className={classes.actionButton} onClick={() => handleUnPairClick(dispatch, terminal.id)}>
                Unpair terminal
              </Button>
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
          <Typography className={classes.text}>
            To update the Pairing configuration you need to unpair this terminal using the Unpair button above
          </Typography>
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
