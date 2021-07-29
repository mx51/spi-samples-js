import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
// icon
import { ReactComponent as UnpluggedIcon } from '../../images/UnpluggedIcon.svg';
// constants
import { PATH_PAIR } from '../../definitions/constants/routerConfigs';
// style
import useStyles from './index.styles';

const NoTerminalPage: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <UnpluggedIcon />
          <Typography gutterBottom variant="subtitle1">
            It looks like you don’t have any terminals paired yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fortunately, it’s very easy to pair a terminal and start using our Sample POS.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to={PATH_PAIR}>
            + Pair terminal
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default NoTerminalPage;
