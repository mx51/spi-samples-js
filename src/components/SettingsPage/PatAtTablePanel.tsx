import React, { useState } from 'react';
import { Box, Divider, Grid, Switch, TextField, Typography, Button } from '@material-ui/core';
import useStyles from './index.styles';
import spiService, { PayAtTableConfig } from '../../services/spiService';

const payAtTableFormConfig: Array<{ name: keyof PayAtTableConfig; type: 'switch' | 'text'; label: string }> = [
  {
    name: 'payAtTableEnabled',
    type: 'switch',
    label: 'Pay at Table',
  },
  {
    name: 'operatorIdEnabled',
    type: 'switch',
    label: 'Require Operator Id',
  },
  {
    name: 'equalSplitEnabled',
    type: 'switch',
    label: 'Enable Equal Split',
  },
  {
    name: 'splitByAmountEnabled',
    type: 'switch',
    label: 'Enable Split By Amount',
  },
  {
    name: 'tableRetrievalEnabled',
    type: 'switch',
    label: 'Enable Table Retrieval',
  },
  {
    name: 'tippingEnabled',
    type: 'switch',
    label: 'Enable Tipping',
  },
  {
    name: 'summaryReportEnabled',
    type: 'switch',
    label: 'Enable Summary Report',
  },
  {
    name: 'labelPayButton',
    type: 'text',
    label: 'Pay Button Label',
  },
  {
    name: 'labelOperatorId',
    type: 'text',
    label: 'Operator ID label',
  },
  {
    name: 'labelTableId',
    type: 'text',
    label: 'Table ID label',
  },
  {
    name: 'allowedOperatorIds',
    type: 'text',
    label: 'Allowed Operator IDs',
  },
];

export const PatAtTablePanel: React.FC = () => {
  const classes = useStyles();
  const [patConfig, setPatConfig] = useState<PayAtTableConfig>(spiService.state.patConfig);

  const handleToggleConfigChange = (name: keyof PayAtTableConfig, enabled: boolean) => {
    setPatConfig({
      ...patConfig,
      [name]: enabled,
    });
  };

  const handleTextConfigChange = (name: keyof PayAtTableConfig, value: string) => {
    if (name === 'allowedOperatorIds') {
      setPatConfig({
        ...patConfig,
        [name]: value.split(','),
      });
      return;
    }
    setPatConfig({
      ...patConfig,
      [name]: value,
    });
  };

  return (
    <Box className={classes.toolContainer}>
      <Typography component="h1" className={classes.h1}>
        Pat At Table
      </Typography>
      <Typography>Configure Pat At Table</Typography>
      <Divider className={classes.divider} />
      <div className={classes.patSettingsFormContainer}>
        {payAtTableFormConfig.map(({ name, label, type }) => {
          const textInput = type === 'text';

          return (
            <Grid key={name} container alignItems="center">
              {textInput ? null : (
                <Grid item xs={4}>
                  <Typography className={classes.infoText}>{label}</Typography>
                </Grid>
              )}
              <Grid item xs={textInput ? 11 : 7}>
                {type === 'switch' ? (
                  <Switch
                    name={name}
                    checked={patConfig[name] as boolean}
                    onChange={(_, enabled) => {
                      handleToggleConfigChange(name, enabled);
                    }}
                  />
                ) : (
                  <TextField
                    name={name}
                    className={classes.textField}
                    label={label}
                    multiline
                    fullWidth
                    placeholder={label}
                    onChange={(e) => {
                      handleTextConfigChange(name, e.target.value);
                    }}
                    value={patConfig[name] as string}
                  />
                )}
              </Grid>
            </Grid>
          );
        })}
        <Button onClick={() => spiService.updatePatConfig(patConfig)} color="primary" variant="contained">
          Save
        </Button>
      </div>
    </Box>
  );
};
