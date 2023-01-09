import { autorun, makeAutoObservable } from "mobx";
import { v1 as uuidv1 } from 'uuid';
// import { SignallingService } from "../services/signalling.service";
import { WebRTCService } from "../services/webRTC.service";


export class SignallingStore {

    webRTCService: WebRTCService = new WebRTCService();

    private socket: WebSocket;
    connected: boolean;
    serverUrl: string;
    vrCapable: boolean;
    codeConfrimatiom: boolean;
    uuid: string;
    iceCredentials: string;
    paired: boolean;
    pairedDeviceId: string;

    private devices: any[];

    constructor() {
        makeAutoObservable(this);

        this.devices = new Array<any>();
        this.codeConfrimatiom = false;
        this.connected = false;

        // @ts-ignore
        this.vrCapable = navigator.xr ? true : false;

        if(localStorage.getItem('vrdavis-id'))
            this.uuid = localStorage.getItem('vrdavis-id');
        else
            localStorage.setItem('vrdavis-id', uuidv1());
    }

    async start() {
        this.socket = new WebSocket('ws://localhost:8080');

        this.socket.onopen = (event) => {
            console.log('[open] Connection established');
            this.connected = true;
            this.sendMessage({ 
                type: 'open',
                data: {
                    id: this.uuid,
                    vr: this.vrCapable
                }
            });
        }

        this.socket.onerror = (event) => {
            this.connected = false;
        }

        this.socket.onmessage = async (event) => {
            console.log(`[received] ${event.data}`);
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case 'paired':
                    this.setPaired(msg.data.paired);
                    this.setPairedDeviceId(msg.data.pairId);
                    break;
                case 'devices':
                    this.setDevices(msg.data.devices);
                    break;
                case 'pair-code-confirmation-request':
                    this.codeConfrimatiom = true;
                    break;
                case 'ice-credentials-request':
                    await this.webRTCService.createPeerConnection();
                    this.sendMessage({ 
                        type: 'ice-credentials-response',
                        data: {
                            offer: await this.webRTCService.createOffer(),
                            pairedId: this.pairedDeviceId
                        }
                    });
                    break;
                case 'rtc-offer':
                    const offer = msg.data.offer;
                    this.sendMessage({ 
                        type: 'rtc-answer',
                        data: {
                            answer: await this.webRTCService.answerOffer(offer),
                            pairedId: this.pairedDeviceId
                        }
                    });
                    break;
                case 'rtc-answer':
                    const answer = msg.data.answer;
                    await this.webRTCService.addCandidate(answer);
                    break;
                default:
                    console.log(`[error] unknown message type "${msg.type}"`);
                    break;
            }
        }

    }

    sendMessage(message: any) {
        const msg = JSON.stringify(message);
        this.socket.send(msg);
        console.log(`[send] ${msg}`)
    }

    getDevices() {
        if(this.devices) return this.devices;
        return [];
    }

    setDevices(newDevices: any[]) {
        this.devices = [...newDevices]
    }

    getCodeConfirmation() {
        return this.codeConfrimatiom;
    }

    setCodeConfirmation(state: boolean) {
        this.codeConfrimatiom = state;
    }

    getPaired() {
        return this.paired;
    }

    setPaired(paired: boolean) {
        this.paired = paired;
    }

    getPairedDeviceId() {
        return this.pairedDeviceId;
    }

    setPairedDeviceId(pairedId: string) {
        this.pairedDeviceId = pairedId;
    }

    getConnectionStatus() {
        return this.connected;
    }
}