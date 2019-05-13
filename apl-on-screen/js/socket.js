
const URL = "apl2019p1943019174trial.hanatrial.ondemand.com";
//team/preview
function onLoad (){
   //doSoldOutAnimation();
    let wsUri = "wss://"+URL+"/APL2019/projector/goyanibhavik369@gmail.com";
    let websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    websocket.onopen = function(evt) { onOpen(evt) };
}

function doSoldOutAnimation() {
    $('.stamp').fadeIn('fast');
    $('.stamp').animate({opacity:1}, 300);

    $('.stamp').animate({ width:434, height:387, top:200, left:220}, 600, 'easeInOutExpo', function(){
        $('#aproved').css('opacity', '0.8');
        $(this).delay(500).animate({opacity:0, width:890, height:890, top:300, left:250}, 700, 'easeInOutExpo');

    });
}
function resetSoldAnimation(){
    $('#aproved').css('opacity',0);
    
}

function onMessage(evt) {
 //@jatan evt.data consists of player data in our case
    resetSoldAnimation();
    console.log("received over websockets: " + evt.data);
    document.getElementById("blindOnScreen").style.display = 'none';
    let response = JSON.parse(evt.data);
    if(response.type === "team"){
        document.getElementById('playerScreen').style.display = 'none';
        document.getElementById('allTeamScreen').style.display = 'block';
       
        showAllTeamScreen(response);
        
    }
    else{
        document.getElementById('allTeamScreen').style.display = 'none';
        document.getElementById('playerScreen').style.display = 'block';
        showPlayerScreen(response);
       
    }
     
};


function loadTeamListData(team, teamListElementByID) {
    let teamListTag = document.getElementById(teamListElementByID);
    if (team.myTeam) {
        team.myTeam.forEach(function (player, i) {
            if (!document.getElementById(player._id)) {
                let li = document.createElement("li");
                li.setAttribute("id", player._id);
               // li.appendChild(document.createTextNode(player.firstName + " " + player.lastName));
                li.appendChild(document.createTextNode("\u2022" + " "+player.firstName + " " + player.lastName));
                teamListTag.appendChild(li);
            }
        });
    }
};

function showAllTeamScreen(response){
    const teams = JSON.parse(response.json);
    console.log("Team preview screen");
    console.log(teams);
    teams.forEach(function(team){
        switch (team.teamName) {
            case "Griffintown Warriors":
                loadTeamListData(team, "gw");
                break;
            case "TMR Supersonics":
                loadTeamListData(team, "tmr");
                break;
            case "Laval Titans":
                loadTeamListData(team, "lt");
                break;
            case "ParcEx Knight Riders":
                loadTeamListData(team, "px");
                break;
            case "West Island Mustangs":
                loadTeamListData(team, "wim");
                break;
            case "Verdun Vikings":
                loadTeamListData(team, "vv");
                break;
            case "Westmount Fury":
                loadTeamListData(team, "wf");
                break;
            case "Lachine Mavericks":
                loadTeamListData(team, "lm");
                break;
            case "Mont Royal Eagles":
                loadTeamListData(team, "mre");
                break;
            case "South Shore Lions":
                loadTeamListData(team, "ssl");
                break;
            case "Downtown Thunders":
                loadTeamListData(team, "dt");
                break;
            case "NDG Strikers":
                loadTeamListData(team, "ndg");
                break;
            default:
                break;

        }
    })
}

function showPlayerScreen(response){
    const player = JSON.parse(response.json);
    console.log("Player Screen");
    let blindBlinker = document.getElementById("blindOnScreen");
    blindBlinker.style.display = "none";
    let pImage = document.getElementById("playerImage")
    let pName = document.getElementById("name")
    let pBattingSkills = document.getElementById("battingSkills")
    let pBowlingSkills = document.getElementById("bowlingSkills")
    let pFieldingSkills = document.getElementById("fieldingSkills")

    let pBattingComments = document.getElementById("battingComments");
    let pBowlingComments = document.getElementById("bowlingComments");
    let pFieldingComments = document.getElementById("fieldingComments");
    
    
    pImage.src = player.photo;
    pName.innerHTML = player.firstName + " " + player.lastName;

    pBattingSkills.innerHTML = player.battingRating;
    pBowlingSkills .innerHTML = player.bowlingRating;
    pFieldingSkills .innerHTML = player.fieldingRating;

    pBattingComments.innerHTML = player.battingComment;
    pBowlingComments .innerHTML = player.bowlingComment;
    pFieldingComments.innerHTML = player.fieldingComment;
    
    if(player.isBlind){
        blindBlinker.style.display = "block";
     }

    if(player.teamName){
            blindBlinker.style.display = "none";
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
                

