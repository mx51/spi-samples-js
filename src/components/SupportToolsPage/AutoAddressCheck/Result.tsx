import React from 'react';
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
          <Typography component="h1" className={`${classes.h1} ${classes.resultTitle}`}>
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
                        <Typography className={classes.tableKeyText}>Environment</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>
                          {testMode ? 'Sandbox' : 'Production'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>IP</Typography>
                      </TableCell>
                      <TableCell>
                        <a
                          className={classes.tableValueLink}
                          href={`http://${ip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ip}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>FDQN</Typography>
                      </TableCell>
                      <TableCell>
                        <a
                          className={classes.tableValueLink}
                          href={`https://${fqdn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fqdn}
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>Last Updated Fqdn</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>{timeStampFqdn}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>Last Updated IP</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>{timeStampIp}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider className={classes.divider} />
            </Grid>
            <Grid container item direction="column" xs={12}>
              <Typography>Google API</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>FQDN</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>
                          {googleDns.Answer && googleDns.Answer.length > 0 ? googleDns.Answer[0].name : googleDns}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>IP</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>
                          {googleDns.Answer && googleDns.Answer.length > 0 ? googleDns.Answer[0].data : googleDns}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider className={classes.divider} />
            </Grid>
            <Grid container item direction="column" xs={12}>
              <Typography>Web Socket Connection</Typography>
              <TableContainer>
                <Table className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Typography className={classes.tableKeyText}>FQDN</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.tableValueText}>{webSocketConnectionFqdn}</Typography>
                      </TableCell>
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
