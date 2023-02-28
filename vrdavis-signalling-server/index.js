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
    let pairingDeviceId;
    let pairingDeviceName;

    ws.on('message', async function message(data) {
        log(`[received] ${data}`);

        let msg = JSON.parse(data);

        switch (msg.type) {
            case 'clear-pairs': 
                await clearPairs();
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
                ws.id = msg.data.id;
                ws.vr = msg.data.vr;
                ws.name = msg.data.name;
                let pairedDevice = await getPairedDevice(msg.data.id);
                console.log(pairedDevice)
                if(await isPaired(msg.data.id))
                {
                    ws.send(JSON.stringify({
                        type: 'paired',
                        data: {
                            paired: true,
                            pairedId: pairedDevice.uuid,
                            pairedName: pairedDevice.name
                        }
                    }));
                    log('[send] Device is already paired');
                    await requestIceCredentials(ws.id);
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
                ws.send(JSON.stringify({
                    type: 'pairs',
                    data: await getPairs()
                }));
                break;
            case 'pair-code':
                pairingDeviceId = msg.data.uuid;
                pairingDeviceName = msg.data.name;
                pairingCodes.push(msg.data.code);
                requestPairConfirmation(msg.data.uuid);
                break;
            case 'pair-code-confrimation-response':
                pairingCodes.push(msg.data.code)
                if(pairingCodes[0] === pairingCodes[1]) {
                    await db.read();
                    log('[info] Pairing codes match');
                    const { pairs } = db.data
                    pairs.push({
                        vrDevice: {
                            name: pairingDeviceName,
                            uuid: pairingDeviceId
                        },
                        desktopDevice: {
                            name: ws.name,
                            uuid: ws.id
                        }
                    })
                    await db.write();
                    log('[info] Pair added to db');
                    ws.send(JSON.stringify({
                        type: 'paired',
                        data: {
                            paired: true,
                            pairId: pairingDeviceId,
                            pairName: pairingDeviceName
                        }
                    }));
                    log('[send] Pairing confirmation');
                    await requestIceCredentials(ws.id);
                } 
                else log(`[error] Pairing codes do not match`)
                break;
            case 'ice-credentials-response':
                // ws.ice = msg.data.ice
                log('[info] ICE credentials received')
                // send ice credentials to paired device
                const offer = msg.data.offer;
                // const pairedId = await getPairedDevice(ws.id);
                await sendOffer(msg.data.pairedId, offer);
                break;
            case 'rtc-answer':
                log('[info] Web RTC answer received')
                const answer = msg.data.answer;
                await sendAnswer(msg.data.pairedId, answer);
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
};

const getPairs = async () => {
    return db.data;
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

const requestPairConfirmation = (id) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'pair-code-confirmation-request',
                data: {}
            }));
            log('[send] Pair code confirmation request');
        }
    });
}

const isPaired = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let flag = false;
    if(pairs.length > 0) {
        pairs.forEach(pair => {
            if(pair.vrDevice.uuid === id || pair.desktopDevice.uuid === id)
                flag = true;
        });
    }
    return flag;
}

const getDevicePair = async (id) => {
    await db.read();
    const { pairs } = db.data;
    if(pairs.length > 0) {
        pairs.forEach(pair => {
            if(pair.desktopDevice === id || pair.vrDevice === id)
                // console.log(pair)
                return pair;
        });
    }
    return null;
}

const getPairedDevice = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let pairedDevice;
    if(pairs.length > 0) {
        pairs.forEach(pair => {
            if(pair.desktopDevice.uuid === id)
                pairedDevice = pair.desktopDevice;
            else if (pair.vrDevice.uuid === id)
                pairedDevice = pair.vrDevice;
        });
    }
    else return null;
    return pairedDevice;
}

const sendOffer = async (id, offer) => {
    wss.clients.forEach(function each(client) {
        if(client.id === id) {
            client.send(JSON.stringify({
                type: 'rtc-offer',
                data: {
                    offer: offer
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
                type: 'rtc-answer',
                data: {
                    answer: answer
                }
            }));
            log('[send] Web RTC answer');
            return;
        }
    });
}

const requestIceCredentials = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let devicePair = null;
    if(pairs.length > 0) {
        pairs.forEach(pair => {
            if(pair.desktopDevice.uuid === id || pair.vrDevice.uuid === id)
                devicePair = pair
        });
    }
    wss.clients.forEach(function each(client) {
        if(client.id === devicePair.desktopDevice.uuid || client.id === devicePair.vrDevice.uuid) {
            client.send(JSON.stringify({
                type: 'ice-credentials-request',
                data: {}
            }));
            log('[send] ICE credentials request');
        }
    });
}

server.listen(PORT, function() {
    log(`Server is listening on port ${PORT}`);
})

// if(wss)
//     log("Signaling server listening on port " + PORT);
// else
//     log("ERROR: Unable to create WebSocket server!");

// wss.on('connection', function connection(ws) {
//     log('[open] Client connected');

//     ws.on('message', function message(data) {
//         console.log('received: %s', data);

    //     let jsonObject = JSON.parse(data)

        // switch (jsonObject.type) {
        //     case 'open':
        //         log(JSON.stringify(jsonObject.data));
        //         ws.send(JSON.stringify({
        //             type: 'devices',
        //             data: {
        //                 devices: ['device1', 'device2', 'device3']
        //             }
        //         }));
        //         break;
        //     default:
        //         log('unknown message type');
        //         break;
        // }
//     });

    

    
// });

function log(text) {
    var time = new Date();
    console.log("[" + time.toLocaleTimeString() + "] " + text);
}
