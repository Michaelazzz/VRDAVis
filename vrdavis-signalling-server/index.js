import { join, dirname } from 'path';
import { Low, JSONFileSync } from 'lowdb';
import { fileURLToPath } from 'url'

import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';

// Database - LowDB
const directory = dirname(fileURLToPath(import.meta.url));

const file = join(directory, 'db.json');
const adapter = new JSONFileSync(file);
const db = new Low(adapter);
await db.read();

if(db) log('[info] Database connected');

const PORT = process.env.PORT || 3003;
// const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

app.get('*', function (req, res) {
    res.send('Hello World!');
});

const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
    const pairingCodes = new Array();
    let vrDeviceId;
    let vrDeviceName;

    ws.on('message', async function message(data) {
        log(`[received] ${data}`);

        let msg = JSON.parse(data);

        switch (msg.type) {
            case 'clear-pairs': 
                await clearPairs();
                
                log('[send] Cleared all device pairs');
                ws.send(JSON.stringify({
                    type: 'devices',
                    data: {
                        devices: await getAvailableVRDevices()
                    }
                }));
                log('[send] Available devices');
                break;
            case 'get-pairs':
                ws.send(JSON.stringify({
                    type: 'pairs',
                    data: {
                        pairs: await getPairs()
                    }
                }));
                log('[send] Device pairs');
                break;
            case 'open':
                // check if device is paired
                ws.id = msg.data.uuid;
                ws.vr = msg.data.vr;
                ws.name = msg.data.name;
                if(await isPaired(ws.id))
                {
                    const pair = await getPair(ws.id);
                    vrDeviceId = pair.vrDevice.uuid;
                    vrDeviceName = pair.vrDevice.name;
                    await sendPaired(pair);
                    log('[send] Device is already paired');
                    ws.send(JSON.stringify({
                        type: 'pairs',
                        data: await getPairs()
                    }));
                    log('[send] Device pairs');
                }
                else {
                    // start pairing process
                    ws.send(JSON.stringify({
                        type: 'devices',
                        data: {
                            devices: await getAvailableVRDevices()
                        }
                    }));
                    log('[send] Available devices');
                }
                break;
            case 'code':
                vrDeviceId = msg.data.vrDevice.uuid;
                vrDeviceName = msg.data.vrDevice.name;
                ws.pairingCode = msg.data.code;
                requestPairConfirmation(vrDeviceId, msg.data.desktopDevice);
                break;
            case 'code-confrimation':
                ws.pairingCode = msg.data.code;
                if(checkCode(ws.pairingCode)) {
                    await db.read();
                    log('[info] Pairing codes match');
                    const { pairs } = db.data
                    const pair = {
                        vrDevice: {
                            name: ws.name,
                            uuid: ws.id
                        },
                        desktopDevice: msg.data.desktopDevice
                    }
                    await pairs.push(pair)
                    await db.write();
                    log('[info] Pair added to db');
                    // send pair details to both clients
                    await sendPaired(pair)
                    ws.send(JSON.stringify({
                        type: 'pairs',
                        data: await getPairs()
                    }));
                } 
                else log(`[error] Pairing codes do not match`)
                break;
            case 'ready':
                //check if paired device is connected
                if(isPairedDeviceConnected(vrDeviceId)){
                    ws.send(JSON.stringify({
                        type: 'ready',
                        data: {}
                    }));
                    log('[send] ready to start Web RTC');
                }
                break;
            case 'candidate':
                const candidate = msg.data;
                await sendCandidate(msg.data.device, candidate);
                break;
            case 'offer':
                const offer = msg.data;
                await sendOffer(msg.data.device, offer);
                break;
            case 'answer':
                const answer = msg.data;
                await sendAnswer(msg.data.device, answer);
                break;
            case 'bye':
                const bye = msg.data;
                await sendBye(ws.id, bye)
                break;
            default:
                log(`[error] unknown message type "${msg.type}"`);
                break;
        }

        wss.clients.forEach(function each(client) {
            if(client != ws && client.readyState == WebSocket.OPEN) {
                // client.send(data);
                // console.log()
            }
        });
    });
});

const clearPairs = async () => {
    db.data.pairs = [];
    await db.write();

    wss.clients.forEach(async function each(client) {
        ws.send(JSON.stringify({
            type: 'pairs',
            data: await getPairs()
        }));
    });
};

const getPairs = async () => {
    return db.data;
};

const sendPaired = async (pair) => {
    wss.clients.forEach(function each(client) {
        if(pair.vrDevice.uuid === client.id || pair.desktopDevice.uuid === client.id) {
            client.send(JSON.stringify({
                type: 'paired',
                data: {
                    paired: true,
                    pair: pair
                }
            }));
            log('[send] Pairing complete');
            return;
        }
    });
}

const isPairedDeviceConnected = (id) => {
    let flag = false;
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            flag = true;
        }
    });
    return flag;
}

const checkCode = async (code) => {
    wss.clients.forEach(function each(client) {
        if(client.pairingCode === code) {
            return true;
        }
    });
    return false;
};

const getAvailableVRDevices = async () => {
    const devices = new Array();
    wss.clients.forEach(function each(client) {
        // if(client != ws && client.readyState == WebSocket.OPEN) {
        if(client.readyState == WebSocket.OPEN && client.vr) {
            devices.push({uuid: client.id, name: client.name});
        }
    });
    return devices;
};

const requestPairConfirmation = (id, desktopDevice) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'code-confirmation',
                data: {
                    desktopDevice: desktopDevice
                }
            }));
            log('[send] Pair code confirmation request');
        }
    });
}

const isPaired = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let flag = false;
    pairs.forEach(pair => {
        if(pair.vrDevice.uuid === id || pair.desktopDevice.uuid === id)
            flag = true;
    });
    return flag;
}

const getPair = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let foundPair = null;
    pairs.forEach(pair => {
        if(pair.desktopDevice.uuid === id || pair.vrDevice.uuid === id) {
            foundPair = pair;
        }
    });
    return foundPair;
}
    
// web RTC 

const sendCandidate = async (id, candidate) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'candidate',
                data: {
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex
                }
            }));
            log('[send] Web RTC offer');
            return;
        }
    });
}

const sendOffer = async (id, offer) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'offer',
                data: {
                    sdp: offer.sdp
                }
            }));
            log('[send] Web RTC offer');
            return;
        }
    });
}

const sendAnswer = async (id, answer) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'answer',
                data: {
                    sdp: answer.sdp
                }
            }));
            log('[send] Web RTC answer');
            return;
        }
    });
}

const sendBye = async (id, bye) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'bye',
                data: bye
            }));
            log('[send] Web RTC answer');
            return;
        }
    });
}

server.listen(PORT, function() {
    log(`Server is listening on port ${PORT}`);
});

function log(text) {
    var time = new Date();
    console.log("[" + time.toLocaleTimeString() + "] " + text);
}
