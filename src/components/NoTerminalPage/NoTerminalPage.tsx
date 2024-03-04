import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH_TERMINALS } from '../../definitions/constants/routerConfigs';
import { ReactComponent as UnpluggedIcon } from '../../images/UnpluggedIcon.svg';
import useStyles from './index.styles';
import { terminalList } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';

const NoTerminalPage: React.FC = () => {
  const classes = useStyles();
  const terminals = useSelector(terminalList);
  const terminalCount = terminals.length;

  return (
    <Grid>
      <Grid item>
        <Paper className={classes.paper} elevation={0}>
          <UnpluggedIcon />
          <Typography gutterBottom variant="subtitle1">
            {terminalCount === 0
              ? "You don't have any terminals paired yet."
              : "You currently don't have any terminals connected"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {terminalCount === 0
              ? "Fortunately, it's very easy to pair a terminal and start using Espresso POS."
              : 'View your existing terminal list or pair a new terminal.'}
          </Typography>
          <Button variant="contained" color="primary" component={Link} to={PATH_TERMINALS}>
            Go to terminals
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default NoTerminalPage;
