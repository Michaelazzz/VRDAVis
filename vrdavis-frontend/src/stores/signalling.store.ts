// @ts-nocheck
import { makeAutoObservable } from "mobx";
import { v1 as uuidv1 } from 'uuid';
// import { SignallingService } from "../services/signalling.service";
// import { WebRTCService } from '../services/webRTC.service';

export class SignallingStore {

    // webRTCService: WebRTCService = new WebRTCService();

    // pairing

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

    // web RTC
    public peerConnection: RTCPeerConnection
    public sendChannel: RTCDataChannel;
    public receiveChannel: RTCDataChannel;

    public dataChannelReceive: string
    public dataChannelSend: string

    servers: any

    dataChannelParams:any = {ordered: false};

    logs: string[];

    constructor() {
        makeAutoObservable(this);

        this.devices = new Array<any>();
        this.pairs = new Array<any>();
        this.codeConfrimatiom = false;
        this.connected = false;

        this.logs = new Array<string>();

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

    // pairing

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
            this.logs.push(`[received] ${event.data}`)
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
                        this.sendMessage({ 
                            type: 'ready',
                            data: {}
                        });
                    }
                    break;
                case 'devices':
                    this.paired = false;
                    this.setDevices(msg.data.devices);
                    break;
                case 'code-confirmation':
                    this.codeConfrimatiom = true;
                    this.setPairedDeviceId(msg.data.desktopDevice.uuid);
                    this.setPairedDeviceName(msg.data.desktopDevice.name);
                    break;
                case 'ready':
                    await this.startWebRTC();
                break;
                case 'candidate':
                    this.handleCandidate(msg.data);
                    break;
                case 'offer':
                    await this.handleOffer(msg.data.sdp);
                    break;
                case 'answer':
                    await this.handleAnswer(msg.data.sdp);
                    break;
                case 'bye':
                    await this.hangup();
                    break;
                default:
                    console.log(`[error] unknown message type "${msg.type}"`);
                    break;
            }
        }

    }

    sendMessage(message: any) {
        message.device = this.name
        const msg = JSON.stringify(message);
        this.socket.send(msg);
        console.log(`[send] ${msg}`)
        this.logs.push(`[send] ${msg}`)
    }

    sendCode(item: any, code: string) {
        this.sendMessage({ 
            type: 'code',
            data: {
                vrDevice: {
                    uuid: item.uuid,
                    name: item.name
                },
                desktopDevice: {
                    uuid: this.uuid,
                    name: this.name
                },
                code: code
            }
        });
    }

    sendConfirmationCode(confirmCode: any) {
        this.sendMessage({ 
            type: 'code-confrimation',
            data: {
                code: confirmCode,
                desktopDevice: {
                    uuid: this.pairedDeviceId,
                    name: this.pairedDeviceName
                }
            }
        })
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

    // web RTC

    startWebRTC = async () => {
        await this.createPeerConnection();

        this.sendChannel = this.peerConnection.createDataChannel('sendDataChannel');
        this.sendChannel.onopen = this.onSendChannelStateChange;
        this.sendChannel.onmessage = this.onSendChannelMessageCallback;
        this.sendChannel.onclose = this.onSendChannelStateChange;

        const offer = await this.peerConnection.createOffer();
        this.sendMessage({ 
            type: 'offer',
            data: {
                device: this.pairedDeviceId,
                sdp: offer.sdp
            }
        });
        await this.peerConnection.setLocalDescription(offer);
    } 

    createPeerConnection = async () => {
        this.peerConnection = new RTCPeerConnection();
        // this.peerConnection = new RTCPeerConnection(this.servers);
        this.peerConnection.onicecandidate = (event: any) => {
            // send ice candidate to paired device
            if (event.candidate) {
                this.sendMessage({ 
                    type: 'candidate',
                    data: {
                        device: this.pairedDeviceId,
                        candidate: event.candidate.candidate,
                        sdpMid: event.candidate.sdpMid,
                        sdpMLineIndex: event.candidate.sdpMLineIndex
                    }
                });
            }
            else { 
                this.sendMessage({ 
                    type: 'candidate',
                    data: {
                        device: this.pairedDeviceId,
                        candidate: null
                    }
                });
            }
        }
    }
    
    handleCandidate = async (candidate: any) => {
        if (!this.peerConnection) {
            console.error('no peer connection');
            this.logs.push('[info] no peer connection');
            return;
        }
        if (!candidate.candidate) {
            // @ts-ignore
            await this.peerConnection.addIceCandidate(null);
        } else {
            await this.peerConnection.addIceCandidate(candidate);
        }
    }

    handleOffer = async (offer: any) => {
        if (this.peerConnection) {
            console.error('existing peer connection');
            this.logs.push('[info] existing peer connection');
            return;
        }
        this.logs.push('[info] handle offer');
        await this.createPeerConnection();
        // @ts-ignore
        this.peerConnection.ondatachannel = this.receiveChannelCallback;
        // @ts-ignore
        await this.peerConnection.setRemoteDescription(offer);
        // @ts-ignore
        const answer = await this.peerConnection.createAnswer();
        this.logs.push('[info] send answer');
        this.sendMessage({ 
            type: 'answer',
            data: {
                device: this.pairedDeviceId,
                sdp: answer.sdp
            }
        });
        // @ts-ignore
        await this.peerConnection.setLocalDescription(answer);
    }

    handleAnswer = async (answer: any) => {
        console.log(answer)
        if (!this.peerConnection) {
            console.error('no peer connection');
            return;
        }
        await this.peerConnection.setRemoteDescription(answer);
    }

    hangup = async () => {
        if (this.peerConnection) {
          this.peerConnection.close();
          // @ts-ignore
          this.peerConnection = null;
        }
        // @ts-ignore
        this.sendChannel = null;
        // @ts-ignore
        this.receiveChannel = null;
        console.log('Closed peer connections');
        this.dataChannelSend = '';
        this.dataChannelReceive = '';
    };

    receiveChannelCallback = (event: any) => {
        console.log('Receive Channel Callback');
        this.receiveChannel = event.channel;
        this.receiveChannel.onmessage = this.onReceiveChannelMessageCallback;
        this.receiveChannel.onopen = this.onReceiveChannelStateChange;
        this.receiveChannel.onclose = this.onReceiveChannelStateChange;
    }
    
    onSendChannelStateChange = () => {
        const readyState = this.sendChannel.readyState;
        console.log('Send channel state is: ' + readyState);
        if (readyState === 'open') {
            // dataChannelSend.disabled = false;
            // dataChannelSend.focus();
            // sendButton.disabled = false;
            // closeButton.disabled = false;
        } else {
            // dataChannelSend.disabled = true;
            // sendButton.disabled = true;
            // closeButton.disabled = true;
        }
    }

    onSendChannelMessageCallback = (event: any) => {
        console.log('Received Message');
        this.dataChannelReceive = event.data;
    }

    onReceiveChannelStateChange = () => {
        const readyState = this.receiveChannel.readyState;
        console.log(`Receive channel state is: ${readyState}`);
        if (readyState === 'open') {
            // dataChannelSend.disabled = false;
            // sendButton.disabled = false;
            // closeButton.disabled = false;
        } else {
            // dataChannelSend.disabled = true;
            // sendButton.disabled = true;
            // closeButton.disabled = true;
        }
      }

    onReceiveChannelMessageCallback = (event: any) => {
        console.log('Received Message');
        this.dataChannelReceive = event.data;
    }
}