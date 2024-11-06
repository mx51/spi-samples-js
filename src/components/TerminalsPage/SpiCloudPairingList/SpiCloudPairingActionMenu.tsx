import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { SpiCloudPairing } from '../../../redux/reducers/PairingSlice/interfaces';
import { ReactComponent as MoreverticalIcon } from '../../../images/MoreVerticalcon.svg';
import { removePairing } from '../../../redux/reducers/PairingSlice/pairingSlice';
import { signedRequestInit } from '../../../utils/common/signRequest';
import { SpiCloudPairingListReducerActions } from './SpiCloudPairingListReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuPaper: {
      border: 'none',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(2),
      boxShadow: `0px 16px 40px -8px ${theme.palette.secondary.main}`,
    },
    subHeading: {
      marginLeft: 16,
      fontWeight: 500,
      letterSpacing: 1,
      color: theme.palette.secondary.dark,
      marginBottom: 8,
    },
    separator: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  })
);

const SpiCloudPairingActionMenu = ({
  pairing,
  dispatch,
}: {
  pairing: SpiCloudPairing;
  dispatch: React.Dispatch<SpiCloudPairingListReducerActions>;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const globalDispatch = useDispatch();

  const classes = useStyles();
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnpair = async () => {
    dispatch({ type: 'loading' });

    const url = `${pairing.spiCloudApiBaseUrl}/api/v1/unpair`;

    try {
      const signedRequest = await signedRequestInit(pairing.keyId, pairing.signingSecret, url, {}, 'POST');

      const response = await fetch(url, {
        ...signedRequest,
      });

      if (!response.ok) {
        dispatch({ type: 'error' });
        throw new Error(response.statusText);
      }

      if (response.ok) {
        dispatch({ type: 'success' });
        globalDispatch(removePairing(pairing.pairingId));
      }
    } catch (error) {
      dispatch({ type: 'error' });
      // eslint-disable-next-line no-console
      console.error('Error unpairing', error);
    }

    handleClose();
  };

  return (
    <div key={`pairing-menu-${pairing.pairingId}`}>
      <IconButton
        id={`pairing-action-button-${pairing.pairingId}`}
        onClick={handleClick}
        aria-label="pairing action menu"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
      >
        <MoreverticalIcon />
      </IconButton>
      <Menu
        classes={{ paper: classes.menuPaper }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography variant="subtitle2" className={classes.subHeading}>
          ACTIONS
        </Typography>
        <MenuItem onClick={handleUnpair}>Unpair terminal</MenuItem>
      </Menu>
    </div>
  );
};

export default SpiCloudPairingActionMenu;
