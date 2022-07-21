// WebSocket signaling server
// Implemented using Node.js

// adapted from https://github.com/mdn/samples-server/blob/master/s/webrtc-from-chat/chatserver.js

"use strict";

var http = require('http');
var https = require('https');
var fs = require('fs');
var WebSocketServer = require('websocket').server;

var connectionArray = [];
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

// Scan the list of connections and return the one for the specified clientID
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

var webServer = null;
var port = 6503;

// any http request get a 404
function handleWebRequest(request, response) {
    log ("Received request for " + request.url);
    response.writeHead(404);
    response.end();
}

webServer = https.createServer();

webServer.listen(port, function() {
    log("Server is listening on port " + port);
});

// create the WebSocket server by converting the HTTPS server into one.
var wsServer = new WebSocketServer({
    httpServer: webServer,
    autoAcceptConnections: false
});

if (!wsServer) {
    log("ERROR: Unable to create WbeSocket server!");
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      log("Connection from " + request.origin + " rejected.");
      return;
    }

    // accept the request and get a connection.
    var connection = request.accept("json", request.origin);

    // add the new connection to our list of connections.
    log("Connection accepted from " + connection.remoteAddress + ".");
    connectionArray.push(connection);

    connection.clientID = nextID;
    nextID++;

    // Send the new client its token
    var msg = {
        type: "id",
        id: connection.clientID
      };
    connection.sendUTF(JSON.stringify(msg));

    // message handler
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            log("Received Message: " + message.utf8Data);
      
            // process incoming data
            var sendToClients = true;
            msg = JSON.parse(message.utf8Data);
            var connect = getConnectionForID(msg.id);

            // check if user is one of the connection cases
            //  1. first connection / looking to pair
            //      if id is not in the database
            //  2. reconnect / has been paired already
            //      if id assigned to ICE credentials are in the database with a paired device

            // switch(msg.type) {
            //     case "message":
            // }
        }
    });

    // handle closing a websocket connection
    connection.on('close', function(reason, description) {
        // First, remove the connection from the list of connections.
        connectionArray = connectionArray.filter(function(el, idx, ar) {
            return el.connected;
        });

        var logMessage = "Connection closed: " + connection.remoteAddress + " (" + reason;
        if (description !== null && description.length !== 0) {
        logMessage += ": " + description;
        }
        logMessage += ")";
        log(logMessage);
    });
});

