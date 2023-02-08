// WebSocket signaling server
// Implemented using Node.js

// adapted from https://github.com/mdn/samples-server/blob/master/s/webrtc-from-chat/chatserver.js
import { join, dirname } from 'path';
import { Low, JSONFileSync } from 'lowdb';
import { parse, fileURLToPath } from 'url';
import { v1 as uuidv1 } from 'uuid'

import http from 'http';
import https from 'https';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';

"use strict";

// Database - LowDB
const directory = dirname(fileURLToPath(import.meta.url));

const file = join(directory, 'db.json');
const adapter = new JSONFileSync(file);
const db = new Low(adapter);

// set default value if there is no data
// db.data ||= { pairs: [] }

// write
// await db.write();

// read 
// await db.read();

// get data from database
// const data = db.get("pairs").value();
// create and query items using plain JS
// db.data.posts.push('hello world')
// const firstPost = db.data.posts[0]
// alternatively, you can also use this syntax if you prefer
// const { posts } = db.data
// posts.push('hello world')

const PORT = 8080;
var wss = new WebSocketServer({ 
	port: PORT,
	clientTracking: true,
});

log("Signaling server listening on port " + PORT);

wss.on('connection', function connection(ws, req) {
	log('Client connected');

	ws.on('message', function message(data) {
		log('received:' + data);
		data = JSON.parse(data)
		if(data.type === 'open') {
			
			// after every new connection update the devices list
			// wss.clients.forEach((client) => {
				// if(ws.ip == client.ip && client.vr) // same network + VR capable device
				// {
					// vrDevices.push(client);
				// }
			// });
			// console.log('open')
			ws.send(JSON.stringify({
				type: 'devices',
				data: {
					devices: ['device1', 'device2', 'device3']
				}
			}));
			// check if id is already a client
			// if(!isIdInClients(jsonObject.data.id)) {
			// 	ws.id = jsonObject.data.id;
			// 	ws.vr = jsonObject.data.vr;
			// }
			// else { 
			// 	ws.close();
			// }
		}
	});

	const vrDevices = [];

	var clientIP = req.socket.remoteAddress;
	ws.ip = clientIP;

	// check if the IP is paired in the database
	const pairs = db.pairs;
	

	// var jsonMessage = {};
	// jsonMessage.type = "id";
	// jsonMessage.data = ws.id;
	// ws.send(JSON.stringify(jsonMessage));
	
	// ws.on('request', function(request) {
	
	// });

	// receive data
	// ws.on('message', function message(data) {
		
	// 	log('received: ' + data);

	// 	var jsonObject = JSON.parse(data);

	

	// 	if(jsonObject.type == "ice") {
	// 		ws.ice = jsonObject.data.ice;
	// 	}

	// 	log("Clients: ")
	// 	wss.clients.forEach(client => {
	// 		console.log("\tID: " + client.id + ", VR: " + client.vr);
	// 	});
	// });
});

function isIdInClients (id) {
	let flag = false;
	wss.clients.forEach((client) => {
		if(client.id == id)
			flag = true;
	});
	return flag;
}

// server.listen(PORT, function() {
//     log("Server is listening on port " + PORT);
// });

var nextID = Date.now();
var appendToMakeUnique = 1;

function log(text) {
    var time = new Date();
    console.log("[" + time.toLocaleTimeString() + "] " + text);
}

// block specific origins
// currently allows everything
function originIsAllowed(origin) {
    return true;    // We will accept all connections
}

// scans the list of users and see if the specified name is unique
// only let unique users join
// if client id is already on the list ignore requests to connect
// prevents two tabs from a single client connecting to one paired VR headset
function isUsernameUnique(name) {
    var isUnique = true;
    var i;
  
    for (i=0; i<connectionArray.length; i++) {
      if (connectionArray[i].username === name) {
        isUnique = false;
        break;
      }
    }
    return isUnique;
}

// send message to a single user
function sendToOneUser(target, msgString) {
    var isUnique = true;
    var i;
  
    for (i=0; i<connectionArray.length; i++) {
      if (connectionArray[i].username === target) {
        connectionArray[i].sendUTF(msgString);
        break;
      }
    }
}

// scan the list of connections and return the one for the specified clientID
function getConnectionForID(id) {
    var connect = null;
    var i;
  
    for (i=0; i<connectionArray.length; i++) {
      if (connectionArray[i].clientID === id) {
        connect = connectionArray[i];
        break;
      }
    }
  
    return connect;
}

// sends list of users 
// adapt to send list of clients that are detected to be on the same network to a specific user
function sendUserListToAll() {
    var userListMsg = makeUserListMessage();
    var userListMsgStr = JSON.stringify(userListMsg);
    var i;
  
    for (i=0; i<connectionArray.length; i++) {
      connectionArray[i].sendUTF(userListMsgStr);
    }
}

// any http request get a 404
function handleWebRequest(request, response) {
    log ("Received request for " + request.url);
    response.writeHead(404);
    response.end();
}

function getSessions() {
	wss.clients.forEach((client) => {
		console.log(client)
	});
}

// if (!wss) {
//     log("ERROR: Unable to create WebSocket server!");
// }

// wss.on('request', function(request) {
//     if (!originIsAllowed(request.origin)) {
//       request.reject();
//       log("Connection from " + request.origin + " rejected.");
//       return;
//     }

//     // accept the request and get a connection.
//     var connection = request.accept("json", request.origin);

//     // add the new connection to our list of connections.
//     log("Connection accepted from " + connection.remoteAddress + ".");
//     connectionArray.push(connection);

//     connection.clientID = nextID;
//     nextID++;

//     // Send the new client its token
//     var msg = {
//         type: "id",
//         id: connection.clientID
//       };
//     connection.sendUTF(JSON.stringify(msg));

//     // message handler
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             log("Received Message: " + message.utf8Data);
      
//             // process incoming data
//             var sendToClients = true;
//             msg = JSON.parse(message.utf8Data);
//             var connect = getConnectionForID(msg.id);

//             // check if user is one of the connection cases
//             //  1. first connection / looking to pair
//             //      if id is not in the database
//             //  2. reconnect / has been paired already
//             //      if id assigned to ICE credentials are in the database with a paired device

//             // switch(msg.type) {
//             //     case "message":
//             // }
//         }
//     });

//     // handle closing a websocket connection
//     connection.on('close', function(reason, description) {
//         // First, remove the connection from the list of connections.
//         connectionArray = connectionArray.filter(function(el, idx, ar) {
//             return el.connected;
//         });

//         var logMessage = "Connection closed: " + connection.remoteAddress + " (" + reason;
//         if (description !== null && description.length !== 0) {
//         logMessage += ": " + description;
//         }
//         logMessage += ")";
//         log(logMessage);
//     });
// });

