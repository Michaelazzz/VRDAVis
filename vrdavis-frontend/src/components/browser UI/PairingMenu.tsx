import { useState, useContext, useRef } from "react";
import { RootContext } from "../../store.context";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import BasicButtonModal from "./BasicButtonModal";
import BasicModal from "./BasicModal";
import { observer } from "mobx-react";

const PairingMenuView: React.FC = () => {
    const { signallingStore } = useContext(RootContext);
    const availableDevices = signallingStore.getDevices();
    const connectionStatus = signallingStore.getConnectionStatus();
    const paired = signallingStore.getPaired();
    const pairedDeviceId = signallingStore.getPairedDeviceId();
    const pairedDeviceName = signallingStore.getPairedDeviceName();
    const pairs = signallingStore.getPairs();

    const [code, setCode] = useState('');
    const [confirmCode, setConfirmCode] = useState('');

    const changeCode = (event: any) => {
        setCode(event.target.value);
        // console.log('value is:', event.target.value);
    };

    const changeConfirmCode = (event: any) => {
        setConfirmCode(event.target.value);
        // console.log('value is:', event.target.value);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // const codeConfirmation = signallingStore.getCodeConfirmation();
    const handleBasicModalClose = () => signallingStore.setCodeConfirmation(false);

    return (
        <>
            <h2>Signalling Server</h2>
            {connectionStatus && pairs.length > 0 && pairs.map((item: any, index: number) => (
                <p>VR device: {item.vrDevice.name} -&gt; Desktop device: {item.desktopDevice.name}</p>
            ))}
            {connectionStatus && pairs.length > 0 && <Button onClick={event => signallingStore.sendMessage({type: 'clear-pairs', data: {}})}>Clear all pairs</Button>}
            {paired && <p>This device is paired to: <b>{ pairedDeviceName }</b></p>}
            {!paired && !connectionStatus && <p>Could not connect to signalling server</p> }
            {!paired && availableDevices.length > 0 &&
                <>
                    <p>Available VR devices: </p>
                    {availableDevices.map((item: any, index: number) => (
                        <BasicButtonModal
                            key={index}
                            open={open}
                            handleOpen={handleOpen}
                            handleClose={handleClose}
                            buttonText={item.name}
                        >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Confirmation code:
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Please enter a number to confirm your connection on this device.
                            </Typography>
                            <Stack spacing={2} direction="row">
                                <TextField 
                                    value={code}
                                    onChange={changeCode}
                                    id="standard-basic" 
                                    label="Code" 
                                    variant="standard" 
                                />
                                <Button 
                                    variant="contained"
                                    onClick={event => {
                                        signallingStore.sendMessage({ 
                                            type: 'pair-code',
                                            data: {
                                                uuid: item.uuid,
                                                name: item.name,
                                                code: code
                                            }
                                        })
                                        handleClose()
                                    }}
                                >Pair</Button>
                            </Stack>
                        </BasicButtonModal>
                    ))}
                </>
            }
            {!paired && availableDevices.length === 0 && connectionStatus && 
                <>
                    <p>No devices are available for pairing</p>
                </>
            }
            <BasicModal
                open={signallingStore.getCodeConfirmation()}
                handleClose={handleBasicModalClose}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Confirm pairing code:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Please confrim pairing code.
                </Typography>
                <Stack spacing={2} direction="row">
                    <TextField 
                        value={confirmCode}
                        onChange={changeConfirmCode}
                        id="standard-basic" 
                        label="Code" 
                        variant="standard" 
                    />
                    <Button 
                        variant="contained"
                        onClick={event => {
                            signallingStore.sendMessage({ 
                                type: 'pair-code-confrimation-response',
                                data: {
                                    code: confirmCode,
                                    vr: signallingStore.vrCapable
                                }
                            })
                            handleBasicModalClose()
                        }}
                    >Pair</Button>
                </Stack>
            </BasicModal>
        </>
    );
}

const PairingMenu = observer(PairingMenuView);
export { PairingMenu };