import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { payAtTableFields, payAtTableOptions } from '../../../../definitions/constants/terminalConfigs';
import CustomTextField from '../../../CustomTextField';
import useStyles from './index.styles';

export default function PaTSettings(): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.sectionSpacing}>
        <Grid item md={4} xs={12}>
          <Typography>Settings</Typography>
        </Grid>
        <Grid item md={8} xs={12}>
          {payAtTableOptions.map(({ name, title, subtitle }) => (
            <Box alignItems="center" className={classes.switchBox} display="flex" key={name}>
              <Typography align="right">
                <Switch name={name} inputProps={{ 'aria-label': title }} />
              </Typography>
              <Box display="flex" flexDirection="column" marginLeft={2}>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="inherit">{subtitle}</Typography>
              </Box>
            </Box>
          ))}
        </Grid>
      </Grid>
      <Grid container className={classes.sectionSpacing}>
        <Grid item md={4} xs={12}>
          <Typography>Customisation</Typography>
        </Grid>
        <Grid item md={8} xs={12}>
          {payAtTableFields.map(({ helperText, id, label }) => (
            <CustomTextField
              key={id}
              fullWidth
              helperText={helperText}
              dataTestId={id}
              label={label}
              margin="dense"
              value=""
              variant="outlined"
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
}
