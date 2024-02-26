import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../../CustomTextField';
import useStyles from './index.styles';
import selectedTerminalIdSelector from '../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import {
  pairedConnectedTerminalList,
  terminalInstance,
} from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { updateSelectedTerminal } from '../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import spiService from '../../../services/spiService';

type Props = {
  setReceipt: React.Dispatch<React.SetStateAction<string>>;
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GetTransactionPanel = ({ setReceipt, hasSearched, setHasSearched }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [posRefId, setPosRefId] = useState<string>('');
  const pairedConnectedTerminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  useEffect(() => {
    if (hasSearched) {
      if (currentTerminal?.txFlow?.isGetTx) {
        setReceipt(currentTerminal?.txFlow?.response?.data.merchantReceipt);
      } else {
        setReceipt('');
      }
    }
  }, [currentTerminal, hasSearched]);

  const onSubmitBtnClick = async () => {
    setReceipt('');
    await spiService.initiateGetTransaction(selectedTerminalId, posRefId);
    setHasSearched(true);
  };

  const onSelectTerminal = (terminalId: string) => {
    dispatch(updateSelectedTerminal(terminalId));
  };

  const isTerminalSelectedAndPaired = () => {
    const userSelectedTerminal = pairedConnectedTerminals.find((terminal) => terminal.id === selectedTerminal);
    return userSelectedTerminal?.status === 'PairedConnected';
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Typography component="h2" className={classes.h2}>
            Lookup
          </Typography>
        </Grid>

        <Grid item xs={7}>
          <CustomTextField
            dataTestId="getTransactionPosRefIdField"
            fullWidth
            label="pos_ref_id"
            margin="dense"
            helperText={currentTerminal?.receipt?.errorDetail}
            onChange={(e) => setPosRefId(e.target.value as string)}
            required
            value={posRefId}
            variant="outlined"
          />

          <Typography className={classes.label}>Select terminal</Typography>
          <Divider />
          <RadioGroup className={classes.radioGroup} aria-label="terminalList" name="terminalList">
            <Box>
              <List>
                {pairedConnectedTerminals.map((terminal) => (
                  <ListItem key={terminal.id} dense disableGutters onClick={() => onSelectTerminal(terminal.id)}>
                    <ListItemIcon>
                      <Radio
                        className={classes.radioBtn}
                        checked={terminal.id === selectedTerminalId}
                        value={terminal.id}
                        name="terminal"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={terminal.posId}
                      secondary={`${terminal.deviceAddress} S/N ${terminal.serialNumber}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </RadioGroup>

          <Button
            className={classes.submitBtn}
            color="primary"
            data-test-id="getTransactionSearchButton"
            onClick={onSubmitBtnClick}
            variant="contained"
            disabled={!isTerminalSelectedAndPaired() || !posRefId}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
