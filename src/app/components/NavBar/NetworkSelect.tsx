import * as React from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  Typography,
  Modal,
  TextField,
  Chip,
} from '@mui/material';
import {
  getActiveNetwork,
  getNetworks,
  changeNetwork,
  addCustomNetwork,
  removeCustomNetwork,
} from 'store/app-config';
import { getCchainStatus } from 'store/cchainSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mdiChevronDown, mdiTrashCanOutline } from '@mdi/js';
import { Network } from 'types/store';
import { useAppSelector } from 'store/configureStore';
import useWidth from 'app/hooks/useWidth';
import MainButton from '../MainButton';
import Icon from '@mdi/react';

function SelectedNetwork({
  value,
  networkStatus,
}: {
  value: string;
  networkStatus: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Chip
        sx={{
          width: '8px',
          height: '8px',
          backgroundColor: networkStatus === 'failed' ? '#DD5E56' : '#35E9AD',
        }}
      />
      <Box
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

const nameOfActiveNetwork = (networks, id) => {
  let active = networks.find(item => item.id === id);
  return active?.displayName;
};

export default function NetworkSelect() {
  const status = useAppSelector(getCchainStatus);
  const navigate = useNavigate();
  const networks = useAppSelector(getNetworks);
  const activeNetwork = useAppSelector(getActiveNetwork);
  const [network, setNetwork] = React.useState(
    nameOfActiveNetwork(networks, activeNetwork),
  );
  const dispatch = useDispatch();
  const handleChange = (event: SelectChangeEvent) => {
    dispatch(changeNetwork(event.target.value));
  };
  React.useEffect(() => {
    setNetwork(nameOfActiveNetwork(networks, activeNetwork));
    // if (activeNetwork === 'camino-testnet') navigate('/');
    // else if (activeNetwork === 'mainnet-testnet') navigate('/mainnet');
    if (activeNetwork === 'mainnet-testnet') navigate('/mainnet');
  }, [activeNetwork]); // eslint-disable-line

  const handleRemoveCustomNetwork = (id: string) => {
    const customNetworks = JSON.parse(
      localStorage.getItem('customNetworks') || '[]',
    );
    const newCustomNetworks = customNetworks.filter(
      network => network.id !== id,
    );
    localStorage.setItem('customNetworks', JSON.stringify(newCustomNetworks));
    dispatch(changeNetwork('Columbus'));
    dispatch(removeCustomNetwork(id));
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Select
        variant="outlined"
        onChange={handleChange}
        value={network}
        IconComponent={() => <Icon path={mdiChevronDown} size={1} />}
        renderValue={() => {
          return <SelectedNetwork value={network} networkStatus={status} />;
        }}
        sx={{
          height: '40px',
          maxWidth: '170px',
          minWidth: '170px',
          borderRadius: '10px',
          padding: '8px 16px',
          '@media (max-width:370px)': {
            minWidth: '120px',
            width: '120px',
          },
          '.MuiSelect-select': {
            paddingRight: '0px !important',
          },
        }}
      >
        {networks.map((item, index) => {
          return (
            <MenuItem key={index} value={item.displayName} sx={{ gap: '10px' }}>
              {item.displayName}
              {!item.predefined && (
                <Button
                  sx={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'secondary.main',
                    borderRadius: '7px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                    },
                  }}
                  onClick={() => {
                    handleRemoveCustomNetwork(item.id);
                  }}
                >
                  <Icon path={mdiTrashCanOutline} size={0.7} color="white" />
                </Button>
              )}
            </MenuItem>
          );
        })}
        <NewNetwork />
      </Select>
    </Box>
  );
}

const NewNetwork = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { isDesktop } = useWidth();

  const [NewNetwork, setNewNetwork] = React.useState({
    id: '',
    displayName: 'My New Network',
    protocol: 'http',
    host: '127.0.0.1',
    magellanAddress: 'http://127.0.0.1:8080' as string,
    port: 9650,
    predefined: false,
  });
  const dispatch = useDispatch();

  // handle duplicate network id
  const handleDuplicateNetworkId = (
    NewNetwork: Network,
    networks: Network[],
  ) => {
    if (
      networks.find(
        item => item.id === NewNetwork.id && item.predefined === false,
      )
    ) {
      return true;
    }
    return false;
  };

  const networks = useAppSelector(getNetworks);
  const [error, setError] = React.useState('');

  const handleSubmit = () => {
    NewNetwork.id = NewNetwork.displayName.replace(/\s/g, '-').toLowerCase();
    if (handleDuplicateNetworkId(NewNetwork, networks)) {
      setError('Network Name already exists');
      return;
    }
    setError('');
    if (NewNetwork.magellanAddress.length === 0)
      NewNetwork.magellanAddress = `${NewNetwork.protocol}//${NewNetwork.host}:${NewNetwork.port}`;
    const ll = localStorage.getItem('customNetworks') as string;
    const customNetworks = JSON.parse(ll) || [];
    customNetworks.push(NewNetwork);
    localStorage.setItem('customNetworks', JSON.stringify(customNetworks));
    dispatch(addCustomNetwork(NewNetwork));
    dispatch(changeNetwork(NewNetwork.displayName));
    document.location.reload();
    setOpen(false);
  };

  return (
    <Box>
      <MenuItem onClick={handleOpen}>
        <Typography variant="body1">Add New Network</Typography>
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '7px',
            padding: '1.5rem',
            minWidth: isDesktop ? '400px' : '0px',
          }}
        >
          <FormControl fullWidth variant="filled" size="medium">
            <TextField
              id="displayName"
              label="Display Name"
              variant="outlined"
              margin="normal"
              defaultValue="My New Network"
              color="secondary"
              fullWidth
              error={handleDuplicateNetworkId(NewNetwork, networks)}
              helperText={error}
              onChange={e =>
                setNewNetwork({ ...NewNetwork, displayName: e.target.value })
              }
            />
            <TextField
              id="protocol"
              label="Protocol"
              variant="outlined"
              margin="normal"
              defaultValue="http"
              color="secondary"
              fullWidth
              onChange={e =>
                setNewNetwork({ ...NewNetwork, protocol: e.target.value })
              }
            />
            <TextField
              id="host"
              label="Host"
              variant="outlined"
              margin="normal"
              defaultValue="127.0.0.1"
              color="secondary"
              fullWidth
              onChange={e =>
                setNewNetwork({ ...NewNetwork, host: e.target.value })
              }
            />
            <TextField
              id="port"
              label="Port"
              variant="outlined"
              margin="normal"
              defaultValue="9650"
              fullWidth
              type="number"
              color="secondary"
              onChange={e =>
                setNewNetwork({ ...NewNetwork, port: Number(e.target.value) })
              }
            />
            <TextField
              id="magellanAddress"
              label="Magellan Address"
              variant="outlined"
              margin="normal"
              color="secondary"
              type="text"
              fullWidth
              onChange={e =>
                setNewNetwork({
                  ...NewNetwork,
                  magellanAddress: e.target.value,
                })
              }
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <MainButton variant="outlined" onClick={handleSubmit}>
                Add Network
              </MainButton>
              <MainButton variant="contained" onClick={handleClose}>
                Cancel
              </MainButton>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
};
