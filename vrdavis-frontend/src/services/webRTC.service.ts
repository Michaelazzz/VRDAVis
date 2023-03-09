export class WebRTCService {

    public peerConnection: RTCPeerConnection
    public sendChannel: RTCDataChannel;
    public receiveChannel: RTCDataChannel;

    public dataChannelReceive: string
    public dataChannelSend: string

    servers: any

    dataChannelParams:any = {ordered: false};

    constructor () {
        // @ts-ignore
        this.peerConnection = null;
        // @ts-ignore
        this.sendChannel = null;
        // @ts-ignore
        this.receiveChannel = null;

        this.dataChannelReceive = '';
        this.dataChannelSend = '';

        this.servers = {
            iceServers: [
                {
                    urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
                },
            ],
            iceCandidatePoolSize: 10,
        };
    }

    start = async () => {
        await this.createPeerConnection();

        this.sendChannel = this.peerConnection.createDataChannel('sendDataChannel');
        this.sendChannel.onopen = this.onSendChannelStateChange;
        this.sendChannel.onmessage = this.onSendChannelMessageCallback;
        this.sendChannel.onclose = this.onSendChannelStateChange;
    } 

    createPeerConnection = async () => {
        this.peerConnection = new RTCPeerConnection();
        // this.peerConnection = new RTCPeerConnection(this.servers);
        this.peerConnection.onicecandidate = (event: any) => {
            // const message = {
            //     type: 'candidate',
            //     candidate: null,
            // };
            if (event.candidate) {
                // message.candidate = event.candidate.candidate;
                // message.sdpMid = event.candidate.sdpMid;
                // message.sdpMLineIndex = event.candidate.sdpMLineIndex;
                
            }
            // send ice candidate to paired device
            //signaling.postMessage(message);
        }
    }

    createOffer = async () => {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
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
    
    handleCandidate = async (candidate: any) => {
        if (!this.peerConnection) {
            console.error('no peer connection');
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
            console.error('existing peerconnection');
            return;
        }
        await this.createPeerConnection();
        // @ts-ignore
        this.peerConnection.ondatachannel = this.receiveChannelCallback;
        // @ts-ignore
        await this.peerConnection.setRemoteDescription(offer);
        // @ts-ignore
        const answer = await this.peerConnection.createAnswer();
        //signaling.postMessage({type: 'answer', sdp: answer.sdp});
        // @ts-ignore
        await this.peerConnection.setLocalDescription(answer);

        return answer;
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



