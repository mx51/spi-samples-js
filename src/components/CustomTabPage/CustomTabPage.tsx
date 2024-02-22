import React from 'react';
import { Box, Container, Divider, Grid, Typography } from '@material-ui/core';
import useStyles from './index.styles';
import { useAppSelector } from '../../redux/hooks';
import { selectedShowFlowPanel } from '../../redux/reducers/CommonSlice/commonSliceSelectors';

interface CustomTabPageProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  title: string;
  subtitle: string;
  customGridPanel?: React.ReactNode;
}

export const CustomTabPage = ({
  children,
  value,
  index,
  title,
  subtitle,
  customGridPanel,
  ...other
}: CustomTabPageProps) => {
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
        <Container className={classes.root} maxWidth="lg">
          <Grid container className={classes.container}>
            <Grid item>
              <Box className={classes.lookupContainer}>
                <Typography component="h1" className={classes.h1}>
                  {title}
                </Typography>
                <Typography>{subtitle}</Typography>
                <Divider className={classes.divider} />
                <Grid>{children}</Grid>
              </Box>
            </Grid>
            <Grid container spacing={2}>
              {Array.isArray(customGridPanel) ? (
                <>
                  <Grid item xs={4}>
                    {customGridPanel[0]}
                  </Grid>
                  <Grid item xs={8}>
                    {customGridPanel[1]}
                  </Grid>
                </>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};
