import React from 'react';
import { Typography, TableContainer, Table, TableRow, TableCell, TableBody, Divider } from '@material-ui/core';
import useStyles from './index.styles';
import { ErrorResponse, GoogleDns } from './interfaces';

interface Props {
  fqdn: string;
  ip: string;
  timeStampFqdn: string;
  testMode: boolean;
  result: string;
  webSocketConnectionFqdn: string;
  timeStampIp: string;
  errorResponse: ErrorResponse;
  googleDns: GoogleDns;
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
          <Typography className={classes.tableTitle}>Device Address API</Typography>
          <TableContainer>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>Environment</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{testMode ? 'Sandbox' : 'Production'}</Typography>
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
          <Typography className={classes.tableTitle}>Google API</Typography>
          <TableContainer>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>FQDN</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{googleDns.Answer[0].name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>IP</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{googleDns.Answer[0].data}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Divider className={classes.divider} />
          <Typography className={classes.tableTitle}>Web Socket Connection</Typography>
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
        </div>
      )}
      {result === 'error' && (
        <div>
          <Typography component="h1" className={`${classes.h1} ${classes.resultTitle}`}>
            Auto address test results
          </Typography>
          <Typography className={classes.tableTitle}>Auto address error</Typography>
          <TableContainer>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>Request ID</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{errorResponse.request_id}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>Error code</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{errorResponse.error_code}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography className={classes.tableKeyText}>Error description</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableValueText}>{errorResponse.error}</Typography>
                  </TableCell>
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
