import { useState, useContext, useRef } from "react";
import { RootContext } from "../../store.context";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import BasicButtonModal from "./BasicButtonModal";
import BasicModal from "./BasicModal";
import { observer } from "mobx-react";

const DeviceCredentialsView: React.FC = () => {
    const { signallingStore } = useContext(RootContext);
    let deviceName = signallingStore.getDeviceName();

    const [name, setName] = useState('');

    const changeName = (event: any) => {
        setName(event.target.value);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <p>
            <b>Device credentials:</b><br/> 
            <b>Device name:</b> {deviceName !== 'no name' && localStorage.getItem('vrdavis-device-name') }
            {deviceName === 'no name' && 
            <BasicButtonModal
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                buttonText='add device name'
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Device name:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Please enter a name you would like to use for this device.
                </Typography>
                <Stack spacing={2} direction="row">
                    <TextField 
                        value={name}
                        onChange={changeName}
                        id="standard-basic" 
                        label="Device name:" 
                        variant="standard" 
                    />
                    <Button 
                        variant="contained"
                        onClick={event => {
                            signallingStore.setDeviceName(name)
                            deviceName = signallingStore.getDeviceName();
                            signallingStore.sendMessage({ 
                                type: 'device name',
                                data: {
                                    deviceId: localStorage.getItem('vrdavis-id'),
                                    deviceName: name
                                }
                            })
                            handleClose()
                        }}
                    >Add</Button>
                </Stack>
            </BasicButtonModal>
        } <br/>
            <b>uuid:</b> { localStorage.getItem('vrdavis-id') } <br/>
            <b>VR capable:</b> { navigator.xr ? 'Yes' : 'No' }
        </p>
    );
}

const DeviceCredentials = observer(DeviceCredentialsView);
export { DeviceCredentials };