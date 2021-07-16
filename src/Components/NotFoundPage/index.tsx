import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
// component
import Layout from '../Layout';

const NotFound: React.FC = () => (
  <Layout>
    <Typography>404 Error Found ..</Typography>
    <Typography>
      Back to <Link to="/">Home</Link>
    </Typography>
  </Layout>
);

export default NotFound;
