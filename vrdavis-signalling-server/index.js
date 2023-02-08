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

console.log(process.env);

const PORT = process.env.PORT || 8080;
// const PORT = 80;
const server = http.createServer(express);
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    const pairingCodes = new Array();
    let pairingDeviceId;

    ws.on('message', async function message(data) {
        log(`[received] ${data}`);

        let msg = JSON.parse(data);

        switch (msg.type) {
            case 'open':
                // check if device is paired
                ws.id = msg.data.id;
                ws.vr = msg.data.vr;
                if(await isPaired(msg.data.id))
                {
                    // console.log(await getPairedDevice(msg.data.id));
                    ws.send(JSON.stringify({
                        type: 'paired',
                        data: {
                            paired: true,
                            pairId: await getPairedDevice(msg.data.id)
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
                break;
            case 'pair-code':
                pairingDeviceId = msg.data.device;
                pairingCodes.push(msg.data.code);
                requestPairConfirmation(msg.data.device);
                break;
            case 'pair-code-confrimation-response':
                pairingCodes.push(msg.data.code)
                if(pairingCodes[0] === pairingCodes[1]) {
                    await db.read();
                    log('[info] Pairing codes match');
                    const { pairs } = db.data
                    pairs.push({
                        vrDevice: pairingDeviceId,
                        desktopDevice: ws.id
                    })
                    await db.write();
                    log('[info] Pair added to db');
                    ws.send(JSON.stringify({
                        type: 'paired',
                        data: {
                            paired: true,
                            pairId: pairingDeviceId
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

const getAvailableVRDevices = async () => {
    const devices = new Array();
    wss.clients.forEach(function each(client) {
        // if(client != ws && client.readyState == WebSocket.OPEN) {
        if(client.readyState == WebSocket.OPEN && client.vr) {
            devices.push(client.id);
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
            if(pair.vrDevice === id || pair.desktopDevice === id)
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
                return Jpair;
        });
    }
    return null;
}

const getPairedDevice = async (id) => {
    await db.read();
    const { pairs } = db.data;
    let pairedId = '';
    if(pairs.length > 0) {
        pairs.forEach(pair => {
            if(pair.desktopDevice === id)
                pairedId = pair.desktopDevice;
            else if (pair.vrDevice === id)
                pairedId = pair.vrDevice;
        });
    }
    else return null;
    return pairedId;
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
            if(pair.desktopDevice === id || pair.vrDevice === id)
                devicePair = pair
        });
    }
    wss.clients.forEach(function each(client) {
        
        if(client.id === devicePair.desktopDevice || client.id === devicePair.vrDevice) {
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