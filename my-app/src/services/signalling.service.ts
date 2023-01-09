import { WebRTCService } from "./webRTC.service";
import { v1 as uuidv1 } from "uuid";

export class SignallingService {
    
    async startSocket(url: string)
    {
        return new WebSocket(url);
    }

    messageHandler(event: MessageEvent) {
        var jsonObject = JSON.parse(event.data);
        console.log(jsonObject);

        // switch (jsonObject.type) {
        //     case 'devices':
        //         this.devices = jsonObject.data.devices;
        //         break;
        //     default:
        //         console.log('Unknown message type')
        // }
    }

    async sendMessage(connection: WebSocket, message: string) {
        // console.log(message)
        if (connection.readyState === WebSocket.OPEN) {
            connection.send(message);
            // return true;
        } else {
            console.log("Error sending message");
            // return false;
        }
    }
    
    // getDevices() {
    //     return this.devices;
    // }

    // sendPairingCodeMessage = (pairID: string, code: any) => {
    //     this.sendMessage(JSON.stringify({
    //         type: "pair",
    //         data: {
    //             id: localStorage.getItem('vrdavisID'),
    //             pair_id: pairID,
    //             code: code
    //         }
    //     }));
    // }
}