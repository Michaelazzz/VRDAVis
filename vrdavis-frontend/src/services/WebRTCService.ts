import {action, computed, makeObservable, observable} from "mobx";

const MAX_CHUNK_SIZE = 262144;

export class WebRTCService {
    private static staticInstance: WebRTCService;

    static get Instance() {
        if (!WebRTCService.staticInstance) {
            WebRTCService.staticInstance = new WebRTCService();
        }
        return WebRTCService.staticInstance;   
    }

    public localConnection: RTCPeerConnection;
    public remoteConnection: RTCPeerConnection;
    public sendChannel: RTCDataChannel;
    public receiveChannel: RTCDataChannel;
    public chunkSize: number;
    public lowWaterMark: number;
    public highWaterMark: number;
    public dataString: string;

    private constructor() {
        // makeObservable(this);
    }

    createPeerConnection = async () => {
        console.log('create connection to peer');

        const servers = null;
        this.dataString = "some data to send";

        this.localConnection = new RTCPeerConnection(servers);

        // data channel
        const dataChannelParams = {ordered: false};
        this.sendChannel = this.localConnection.createDataChannel('sendDataChannel', dataChannelParams);
        this.sendChannel.onopen = this.onSendChannelOpen.bind(this);
        this.sendChannel.onclose = this.onSendChannelClosed.bind(this);

        console.log('created send data channel: ', this.sendChannel);
        console.log('created local peer connection object localConnection: ', this.localConnection);

        this.localConnection.addEventListener('icecandidate', e => this.onIceCandidate(this.localConnection, e));
        this.localConnection.onicecandidate = this.onIceCandidate.bind(this);

        // this.remoteConnection = new RTCPeerConnection(servers);
        // this.remoteConnection.addEventListener('icecandidate', e => this.onIceCandidate(this.remoteConnection, e));
        // this.remoteConnection.addEventListener('datachannel', this.receiveChannelCallback);

        try {
            const localOffer = await this.localConnection.createOffer();
            console.log(localOffer)
            await this.handleLocalDescription(localOffer);
        } catch (e) {
            console.error('Failed to create session description: ', e);
        }
    }

    getIceCredentials = async () => {
        return await this.localConnection.createOffer();
    }

    onSendChannelOpen = () => {
        console.log('send channel is open');
        // this.chunkSize = Math.min(this.localConnection.sctp.maxMessageSize, MAX_CHUNK_SIZE);
        // console.log('determined chunk size: ', this.chunkSize);
        // this.dataString = new Array(this.chunkSize).fill('X').join('');
        // this.lowWaterMark = this.chunkSize; // A single chunk
        // this.highWaterMark = Math.max(this.chunkSize * 8, 1048576); // 8 chunks or at least 1 MiB
        // console.log('send buffer low water threshold: ', this.lowWaterMark);
        // console.log('send buffer high water threshold: ', this.highWaterMark);
        // this.sendChannel.bufferedAmountLowThreshold = this.lowWaterMark;
        // this.sendChannel.addEventListener('bufferedamountlow', (e) => {
        //     console.log('BufferedAmountLow event:', e);
        //     this.sendData();
        // });

        this.sendData();
    }

    onSendChannelClosed = () => {
        console.log('send channel is closed');
        this.localConnection.close();
        this.localConnection = null;
        console.log('closed local peer connection');
    }

    sendData = () => {
        console.log("data sent");
        this.sendChannel.send(this.dataString);
    }

    startSendingData = () => {
        this.sendData();
    }

    onIceCandidate = async (pc: any, event: any) => {
        const candidate = event.candidate;
        if (candidate === null) {
            return;
        }

        try {
            await this.getOtherPc(pc).addIceCandidate(candidate);
            console.log('addIceCandidate successful: ', candidate);
            
        } catch (e) {
            console.error('failed to add Ice Candidate: ', e);
        }
    }

    getOtherPc = (pc: any) => {
        return (pc === this.localConnection) ? this.remoteConnection : this.localConnection;
    }

    receiveChannelCallback = (event: any) => {
        console.log('receive channel callback');
        this.receiveChannel = event.channel;
        this.receiveChannel.binaryType = 'arraybuffer';
        this.receiveChannel.addEventListener('close', this.onReceiveChannelClosed);
        this.receiveChannel.addEventListener('message', this.onReceiveMessageCallback);
    }

    onReceiveChannelClosed = () => {
        console.log('receive channel is closed');
        this.remoteConnection.close();
        this.remoteConnection = null;
        console.log('closed remote peer connection');
    }

    onReceiveMessageCallback = (event: any) => {
        console.log('receive messgae callback');
        console.log(event.data)
        // this.sendChannel.close();
        // this.receiveChannel.close();
    }

    handleLocalDescription = async (desc: any) => {
        this.localConnection.setLocalDescription(desc);
        console.log('offer from localConnection:\n', desc.sdp);
        this.remoteConnection.setRemoteDescription(desc);
        try {
            const remoteAnswer = await this.remoteConnection.createAnswer();
            this.handleRemoteAnswer(remoteAnswer);
        } catch (e) {
            console.error('Error when creating remote answer: ', e);
        }
    }

    handleRemoteAnswer = (desc: any) => {
        this.remoteConnection.setLocalDescription(desc);
        console.log('answer from remoteConnection:\n', desc.sdp);
        this.localConnection.setRemoteDescription(desc);
    }
}



