import React, { useState } from 'react';
import { Box, Divider, Grid, Switch, TextField, Typography, Button } from '@material-ui/core';
import useStyles from './index.styles';
import spiService, { PayAtTableConfig } from '../../services/spiService';

const payAtTableFormConfig: Array<{
  name: keyof PayAtTableConfig;
  type: 'switch' | 'text';
  label: string;
  required?: boolean;
}> = [
  {
    name: 'payAtTableEnabled',
    type: 'switch',
    label: 'Pay at Table',
  },
  {
    name: 'operatorIdEnabled',
    type: 'switch',
    label: 'Require Operator ID',
  },
  {
    name: 'allowedOperatorIds',
    type: 'text',
    label: 'Allowed Operator IDs',
    required: true,
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
];

export const PayAtTablePanel: React.FC = () => {
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
        Pay At Table
      </Typography>
      <Typography>Configure Pay At Table</Typography>
      <Divider className={classes.divider} />
      <form
        onSubmit={(event) => {
          spiService.updatePatConfig(patConfig);
          event.preventDefault();
        }}
      >
        <div className={classes.patSettingsFormContainer}>
          {payAtTableFormConfig
            .filter(({ name }) => patConfig.payAtTableEnabled || name === 'payAtTableEnabled')
            .filter(({ name }) => (name === 'allowedOperatorIds' ? patConfig.operatorIdEnabled : true))
            .map(({ name, label, type, required }) => {
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
                        required={required}
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
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </Box>
  );
};
