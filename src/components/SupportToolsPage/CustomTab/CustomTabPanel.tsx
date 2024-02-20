import React from 'react';
import { Box, Container, Divider, Grid, Typography } from '@material-ui/core';
import useStyles from './index.styles';
import { useAppSelector } from '../../../redux/hooks';
import { selectedShowFlowPanel } from '../../../redux/reducers/CommonSlice/commonSliceSelectors';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  title: string;
  subtitle: string;
  customGridComponents?: React.ReactNode;
}

export const CustomTabPanel = ({
  children,
  value,
  index,
  title,
  subtitle,
  customGridComponents,
  ...other
}: TabPanelProps) => {
  const showFlowPanel = useAppSelector(selectedShowFlowPanel);
  const classes = useStyles({ showFlowPanel });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        // <Container className={classes.root} maxWidth="lg">
        <Container maxWidth="lg">
          <Grid container className={classes.container}>
            {/* <Grid container> */}
            <Grid item>
              <Box className={classes.lookupContainer}>
                {/* <Box> */}
                <Typography component="h1" className={classes.h1}>
                  {title}
                </Typography>
                <Typography>{subtitle}</Typography>
                <Divider className={classes.divider} />
                <Grid>{children}</Grid>
              </Box>
            </Grid>
            <Grid item className={classes.panelRow}>
              {/* <Grid item> */}
              {Array.isArray(customGridComponents) ? (
                // <Grid container className={classes.panelRow}>
                <>
                  <Grid item xs={4} className={classes.leftContainer}>
                    {customGridComponents[0]}
                  </Grid>
                  <Grid item xs={8}>
                    {customGridComponents[1]}
                  </Grid>
                  {/* // </Grid> */}
                </>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};
