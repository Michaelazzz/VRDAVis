import { observer } from "mobx-react";
import { useContext, useState } from "react";
import { RootContext } from "../../store.context";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const WebRTCMenuView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    const signallingStore = rootStore.signallingStore;
    const sendChannelState = signallingStore.sendChannelState;
    const receiveChannelState = signallingStore.receiveChannelState;

    const [data, setData] = useState('');

    const changeData = (event: any) => {
        setData(event.target.value);
    };

    return (
        <>
            <h2>Web RTC</h2>
            <p>Send channel state: <b>{sendChannelState}</b></p>
            <p>Receive channel state: <b>{receiveChannelState}</b></p>
            {sendChannelState === 'open' && <>
                <Stack spacing={2} direction="column">
                    {/* <TextField 
                        value={data}
                        onChange={changeData}
                        id="standard-basic"  
                        variant="standard" 
                    />
                    <Button 
                        variant="contained"
                        onClick={event => {
                            signallingStore.sendDataToPeer(data);
                            setData('');
                        }}
                    >Send</Button> */}
                    <Button 
                        variant="contained"
                        onClick={rootStore.transferState}
                    >Transfer State</Button>
                </Stack>
            </>}
            {receiveChannelState === 'open' && <>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Message received:
                </Typography>
                <p>{signallingStore.dataChannelReceive}</p>
            </>}

        </>
    );
}

const WebRTCMenu = observer(WebRTCMenuView);
export { WebRTCMenu };
