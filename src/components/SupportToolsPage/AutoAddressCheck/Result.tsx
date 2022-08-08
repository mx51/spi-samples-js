import React, { useState } from 'react';
import { Typography, Grid, TableContainer, Table, TableRow, TableCell, TableBody, Divider } from '@material-ui/core';
import useStyles from './index.styles';

interface Props {
  fqdn: string;
  ip: string;
  timeStampFqdn: string;
  testMode: boolean;
  result: string;
  webSocketConnectionFqdn: string;
  timeStampIp: string;
  errorResponse: {
    request_id: string;
    error_code: number;
    error: string;
  };
  googleDns: {
    Answer: { name: string; data: string }[];
  };
}

function Result({
  fqdn,
  ip,
  timeStampFqdn,
  testMode,
  result,
  errorResponse,
  googleDns,
  timeStampIp,
  webSocketConnectionFqdn,
}: Props): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      {result && <Divider className={classes.divider} />}
      {result === 'success' && (
        <div>
          <Typography component="h1" className={classes.h1}>
            Auto address test results
          </Typography>
          <Grid container direction="row" spacing={1}>
            <Grid container item direction="column" xs={12}>
              <Typography>Device Address API</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Environment
                      </TableCell>
                      <TableCell>{testMode ? 'Sandbox' : 'Production'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        IP
                      </TableCell>
                      <TableCell>
                        <a href={`http://${ip}`} target="_blank" rel="noopener noreferrer">
                          {ip}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        FQDN
                      </TableCell>
                      <TableCell>
                        <a href={`https://${fqdn}`} target="_blank" rel="noopener noreferrer">
                          {fqdn}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Last Updated Fqdn
                      </TableCell>
                      <TableCell>{timeStampFqdn}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Last Updated IP
                      </TableCell>
                      <TableCell>{timeStampIp}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container item direction="column" xs={12}>
              <Typography>Google API</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        FQDN
                      </TableCell>
                      <TableCell>
                        {googleDns.Answer && googleDns.Answer.length > 0 ? googleDns.Answer[0].name : googleDns}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        IP
                      </TableCell>
                      <TableCell>
                        {googleDns.Answer && googleDns.Answer.length > 0 ? googleDns.Answer[0].data : googleDns}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container item direction="column" xs={12}>
              <Typography>Web Socket Connection</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        FQDN
                      </TableCell>
                      <TableCell align="right">{webSocketConnectionFqdn}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      )}
      {result === 'error' && (
        <div>
          <Typography variant="h6">Error</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Request ID
                  </TableCell>
                  <TableCell align="right">{errorResponse.request_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Error Code
                  </TableCell>
                  <TableCell align="right">{errorResponse.error_code}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Error Description
                  </TableCell>
                  <TableCell align="right">{errorResponse.error}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}

export default Result;
