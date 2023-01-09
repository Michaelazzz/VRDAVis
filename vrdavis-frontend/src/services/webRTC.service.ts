import {action, computed, makeObservable, observable} from "mobx";

const MAX_CHUNK_SIZE = 262144;

export class WebRTCService {
    public peerConnection: RTCPeerConnection;
    public sendChannel: RTCDataChannel;
    public receiveChannel: RTCDataChannel;

    public offerCandidates: any[];

    public remoteConnection: RTCPeerConnection;
    public chunkSize: number;
    public lowWaterMark: number;
    public highWaterMark: number;
    public dataString: string;

    dataChannelParams:any = {ordered: false};

    // constructor() {
    //     this.localChannel = new RTCDataChannel();
    //     this.remoteChannel = new RTCDataChannel();

    //     const servers = {};
    //     this.peerConnection = new RTCPeerConnection(servers);

    //     this.localChannel = this.peerConnection.createDataChannel('localDataChannel', this.dataChannelParams);
    //     this.localChannel.onopen = () => {
    //         console.log('Send channel is open');
    //         console.log(this.localChannel.bufferedAmount)
    //     };
    //     this.peerConnection.onicecandidate = (event) => {
    //         // event.candidate && offer
    //     }
    // }

    createPeerConnection = async () => {
        // this.localChannel = new RTCDataChannel();
        // this.remoteChannel = new RTCDataChannel();

        const servers = {
            iceServers: [
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
                },
            ],
            iceCandidatePoolSize: 10,
        };
        this.peerConnection = new RTCPeerConnection(servers);
        this.offerCandidates = new Array<any>();

        this.sendChannel = this.peerConnection.createDataChannel('localDataChannel', this.dataChannelParams);
        this.sendChannel.onopen = () => {
            console.log('Send channel is open');
            console.log(this.sendChannel.bufferedAmount)
        };
        this.sendChannel.onclose = () => {
            console.log('Send channel is closed');
            this.peerConnection.close();
            console.log('Closed local peer connection');
        };
        console.log('Created send data channel: ', this.sendChannel);

        this.peerConnection.onicecandidate = (event) => {
            const candidate = event.candidate;
            if(candidate === null) {
                return;
            }
            try {
                this.offerCandidates.push(candidate)
                this.peerConnection.addIceCandidate(candidate);
                console.log('addIceCandidate successful: ', candidate);
        
            } catch (e) {
                console.error('failed to add Ice Candidate: ', e);
            }
        };
    }

    createOffer = async () => {
        const offerDescription = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp, // session description protocol
            type: offerDescription.type
        }
        // send offer to signalling server to send to paired device
        return offer;
    }

    answerOffer = async (offer: any) => {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answerDescription = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answerDescription);

        const answer = {
            sdpMid: answerDescription.sdp,
            type: answerDescription.type,
        }

        return answer;
    }

    addCandidate = async (answer: any) => {
        const candidate = new RTCIceCandidate(answer);
        await this.peerConnection.addIceCandidate(candidate);
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
            await this.peerConnection.addIceCandidate(candidate);
            console.log('addIceCandidate successful: ', candidate);
    
        } catch (e) {
            console.error('failed to add Ice Candidate: ', e);
        }
    }
}



