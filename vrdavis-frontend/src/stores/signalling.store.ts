// @ts-nocheck
import { autorun, makeAutoObservable } from "mobx";
import { v1 as uuidv1 } from 'uuid';
// import { SignallingService } from "../services/signalling.service";
import { WebRTCService } from '../services/webRTC.service';

export class SignallingStore {

    webRTCService: WebRTCService = new WebRTCService();

    private socket: WebSocket;
    connected: boolean;
    serverUrl: string;
    vrCapable: boolean;
    codeConfrimatiom: boolean;
    uuid: string;
    name: string;
    iceCredentials: string;
    paired: boolean;
    pairedDeviceId: string;
    pairedDeviceName: string;

    private devices: any[];
    private pairs: any[];

    constructor() {
        makeAutoObservable(this);

        this.devices = new Array<any>();
        this.pairs = new Array<any>();
        this.codeConfrimatiom = false;
        this.connected = false;

        // @ts-ignore
        this.vrCapable = navigator.xr ? true : false;

        if(localStorage.getItem('vrdavis-id'))
            this.uuid = localStorage.getItem('vrdavis-id');
        else
            localStorage.setItem('vrdavis-id', uuidv1());

        if(localStorage.getItem('vrdavis-device-name'))
            this.name = localStorage.getItem('vrdavis-device-name')
        else
            this.name = 'no name';

    }

    async start() {
        this.socket = new WebSocket('wss://vrdavis01.idia.ac.za/');
        // this.socket = new WebSocket('ws://localhost:3003');

        this.socket.onopen = (event) => {
            console.log('[open] Connection established');
            this.connected = true;
            this.sendMessage({ 
                type: 'open',
                data: {
                    uuid: this.uuid,
                    name: this.name,     
                    vr: this.vrCapable
                }
            });
        }

        this.socket.onerror = (event) => {
            console.log(event);
            this.connected = false;
        }

        this.socket.onmessage = async (event) => {
            console.log(`[received] ${event.data}`);
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case 'pairs':
                    this.setPairs(msg.data.pairs)
                    break;
                case 'paired':
                    this.setPaired(msg.data.paired);
                    if(this.vrCapable) {
                        this.setPairedDeviceId(msg.data.pair.desktopDevice.uuid);
                        this.setPairedDeviceName(msg.data.pair.desktopDevice.name);
                    } else {
                        this.setPairedDeviceId(msg.data.pair.vrDevice.uuid);
                        this.setPairedDeviceName(msg.data.pair.vrDevice.name);
                    }
                    this.sendMessage({ 
                        type: 'ready',
                        data: {}
                    });
                    break;
                case 'devices':
                    this.setDevices(msg.data.devices);
                    break;
                case 'pair-code-confirmation-request':
                    this.codeConfrimatiom = true;
                    this.setPairedDeviceId(msg.data.desktopDevice.uuid);
                    this.setPairedDeviceName(msg.data.desktopDevice.name);
                    break;
                case 'ready':
                    await this.webRTCService.start();
                    const offer = await this.webRTCService.createOffer();
                    this.sendMessage({ 
                        type: 'offer',
                        data: {
                            sdp: offer.sdp
                        }
                    });
                break;
                // case 'ice-credentials-request':
                //     this.webRTCService.createPeerConnection();
                //     this.sendMessage({ 
                //         type: 'ice-credentials-response',
                //         data: {
                //             offer: await this.webRTCService.createOffer(),
                //             pairedId: this.pairedDeviceId
                //         }
                //     });
                //     break;
                // case 'rtc-offer':
                //     const offer = msg.data.offer;
                //     this.sendMessage({ 
                //         type: 'rtc-answer',
                //         data: {
                //             answer: await this.webRTCService.answerOffer(offer),
                //             pairedId: this.pairedDeviceId
                //         }
                //     });
                //     break;
                // case 'rtc-answer':
                //     const answer = msg.data.answer;
                //     await this.webRTCService.addCandidate(answer);
                //     break;
                case 'candidate':
                    this.webRTCService.handleCandidate(msg.data);
                    break;
                case 'offer':
                    const answer = await this.webRTCService.handleOffer(msg.data.sdp);
                    if(answer != null | undefined) {
                        this.sendMessage({ 
                            type: 'answer',
                            data: {
                                sdp: answer.sdp
                            }
                        });
                    }
                    break;
                case 'answer':
                    await this.webRTCService.handleAnswer(msg.data.sdp);
                    break;
                case 'bye':
                    await this.webRTCService.hangup();
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
        this.devices = [...newDevices];
    }

    getCodeConfirmation() {
        return this.codeConfrimatiom;
    }

    setCodeConfirmation(status: boolean) {
        this.codeConfrimatiom = status;
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

    setPairedDeviceName(pairedName: string) {
        this.pairedDeviceName = pairedName;
    }

    getPairedDeviceName() {
        return this.pairedDeviceName;
    }

    getConnectionStatus() {
        return this.connected;
    }

    getVRStatus() {
        return this.vrCapable;
    }

    getDeviceName() {
        return this.name;
    }

    setDeviceName(name: string) {
        localStorage.setItem('vrdavis-device-name', name);
        this.name = localStorage.getItem('vrdavis-device-name');
    }

    requestDevicePairs() {
        this.sendMessage({ 
            type: 'get-pairs',
            data: {}
        });
    }

    getPairs() {
        return this.pairs;
    }

    setPairs(newPairs: any[]) {
        this.pairs = [...newPairs]
    }
}