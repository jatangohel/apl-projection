//const URL = "192.168.31.34:8080"
const URL = "localhost:8080"

function onLoad (){
    let wsUri = "ws://"+URL+"/APL2019/projector/projector@gmail.com";
    let websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    websocket.onopen = function(evt) { onOpen(evt) };
}

function onMessage(evt) {
 //@jatan evt.data consists of player data in our case
     console.log("received over websockets: " + evt.data);
     let player = JSON.parse(evt.data);
    document.getElementById("playerImage").src = player.photo;
    document.getElementById("name").innerHTML = player.firstName + " " + player.lastName;
    document.getElementById("battingSkills").value = player.battingRating;
    document.getElementById("bowlingSkills").value = player.bowlingRating;
    document.getElementById("fieldingSkills").value = player.fieldingRating;
    document.getElementById("battingComments").innerHTML = player.battingComment;
    document.getElementById("bowlingComments").innerHTML = player.bowlingComment;
    document.getElementById("fieldingComments").innerHTML = player.fieldingComment;
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
    websocket.send("hey");
}
                

