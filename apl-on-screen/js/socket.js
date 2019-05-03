//const URL = "192.168.31.34:8080"
const URL = "localhost:8080";

function onLoad (){
    let wsUri = "ws://"+URL+"/APL2019/projector/projector@gmail.com";
    let websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    websocket.onopen = function(evt) { onOpen(evt) };
}

function doSoldOutAnimation() {
    $('.stamp').fadeIn('fast');
    $('.stamp').animate({opacity:1}, 300);
    $('.shadow_stamp').delay(200).animate({top:179}, 600);

    $('.stamp').animate({ width:434, height:387, top:57, left:253}, 600, 'easeInOutExpo', function(){
        $('#aproved').css('opacity', '1');
        $(this).delay(500).animate({opacity:0, width:890, height:890, top:78, left:263}, 700, 'easeInOutExpo');

    });
}

function onMessage(evt) {
 //@jatan evt.data consists of player data in our case
     console.log("received over websockets: " + evt.data);
     let player = JSON.parse(evt.data);
    document.getElementById("playerImage").src = player.photo;
    document.getElementById("name").innerHTML = player.firstName + " " + player.lastName;
    document.getElementById("battingSkills").innerHTML = player.battingRating;
    document.getElementById("bowlingSkills").innerHTML = player.bowlingRating;
    document.getElementById("fieldingSkills").innerHTML = player.fieldingRating;
    document.getElementById("battingComments").innerHTML = player.battingComment;
    document.getElementById("bowlingComments").innerHTML = player.bowlingComment;
    document.getElementById("fieldingComments").innerHTML = player.fieldingComment;

    if(player.teamName){
        doSoldOutAnimation();
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
    websocket.send("hey");
}
                

