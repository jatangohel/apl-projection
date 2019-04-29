let wsUri = "ws://localhost:80/APL2019/socket/projector@gmail.com";
let websocket = new WebSocket(wsUri);

websocket.onmessage = function(evt) { onMessage(evt) };
websocket.onerror = function(evt) { onError(evt) };
websocket.onopen = function(evt) { onOpen(evt) };

function onMessage(evt) {
 //@jatan evt.data consists of player data in our case
 console.log("received over websockets: " + evt.data);
 console.log("looked for room index of: "+ evt.data.indexOf("room"));
 let index = evt.data.indexOf("room");
 writeToScreen(evt.data);
    if (index>1) {
      console.log("found room index of: "+ evt.data.indexOf("room"));   
      updateRoomDetails( evt.data);
    }
}


function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function onOpen() {
    writeToScreen("Connected to " + wsUri);
}


function writeToScreen(message) {
console.log("message --> "+message );
}

function sendText() {
    console.log("sending text: " + JSON.parse('{ "name":"John", "age":30, "city":"New York"}'));
    websocket.send("hey");
}
                

