//const URL = "192.168.21.87:80";
const URL = "localhost:8080";

function onLoad (){
   //doSoldOutAnimation();
    let wsUri = "ws://"+URL+"/APL2019/projector/goyanibhavik369@gmail.com";
    let websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    websocket.onopen = function(evt) { onOpen(evt) };
}

function doSoldOutAnimation() {
    $('.stamp').fadeIn('fast');
    $('.stamp').animate({opacity:1}, 300);

    $('.stamp').animate({ width:434, height:387, top:115, left:70}, 600, 'easeInOutExpo', function(){
        $('#aproved').css('opacity', '0.8');
        $(this).delay(500).animate({opacity:0, width:890, height:890, top:78, left:263}, 700, 'easeInOutExpo');

    });
}
function resetSoldAnimation(){
    $('#aproved').css('opacity',0);
    
}

function onMessage(evt) {
 //@jatan evt.data consists of player data in our case
    resetSoldAnimation();
     console.log("received over websockets: " + evt.data);
     let player = JSON.parse(evt.data);
     if(!player.isBlind){
         document.getElementById("playerImage").src = player.photo;
         document.getElementById("name").innerHTML = player.firstName + " " + player.lastName;
         document.getElementById("battingSkills").innerHTML = player.battingRating;
         document.getElementById("bowlingSkills").innerHTML = player.bowlingRating;
         document.getElementById("fieldingSkills").innerHTML = player.fieldingRating;
         document.getElementById("battingComments").innerHTML = player.battingComment;
         document.getElementById("bowlingComments").innerHTML = player.bowlingComment;
         document.getElementById("fieldingComments").innerHTML = player.fieldingComment;
     }
     else{
         document.getElementById("playerImage").src = "images/profile1.png";
         document.getElementById("name").innerHTML = "Blind Player";
         document.getElementById("battingSkills").innerHTML = " ";
         document.getElementById("bowlingSkills").innerHTML = " ";
         document.getElementById("fieldingSkills").innerHTML =" ";
         document.getElementById("battingComments").innerHTML = " ";
         document.getElementById("bowlingComments").innerHTML = " ";
         document.getElementById("fieldingComments").innerHTML = " ";
     }


    if(player.teamName){
        if(player.isBlind){
            document.getElementById("playerImage").src = player.photo;
            document.getElementById("name").innerHTML = player.firstName + " " + player.lastName;
            document.getElementById("battingSkills").innerHTML = player.battingRating;
            document.getElementById("bowlingSkills").innerHTML = player.bowlingRating;
            document.getElementById("fieldingSkills").innerHTML = player.fieldingRating;
            document.getElementById("battingComments").innerHTML = player.battingComment;
            document.getElementById("bowlingComments").innerHTML = player.bowlingComment;
            document.getElementById("fieldingComments").innerHTML = player.fieldingComment;
            window.setTimeout(doSoldOutAnimation, 3000);
        }
        else{
            doSoldOutAnimation();
        }


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
                

