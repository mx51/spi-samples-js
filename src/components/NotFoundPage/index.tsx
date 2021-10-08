import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { PATH_PURCHASE } from '../../definitions/constants/routerConfigs';
import { ReactComponent as NotFoundImage } from '../../images/NotFoundImage.svg';
import Layout from '../Layout';
import useStyles from './index.styles';

const NotFound: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Grid alignItems="center" className={classes.root} container direction="column" spacing={0} justify="center">
        <NotFoundImage />
        <Typography className={classes.title} component="h1" variant="h6">
          Page not found
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          The page you are looking for doesn’t exist or another error occurred.
        </Typography>
        <Button color="primary" component={Link} to={PATH_PURCHASE} variant="contained">
          Go to Sample POS
        </Button>
      </Grid>
    </Layout>
  );
};

export default NotFound;
