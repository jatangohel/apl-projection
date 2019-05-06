let jsonObject = {};
const URL = "192.168.2.196:80";
let editPlayerObject = {};
let defaultBudget = 16000;

const onLoad = async function () {
    try {
        const response = await fetch("http://" + URL + "/APL2019/webapi/logger/login?email=goyanibhavik369@gmail.com&password=1234", {
            method: "GET",
            credentials: 'include'
        });
        loadAllTeamPlayerInformation();
        //internal server error -- handle it @jatan
        if (response.status === 500) {
            console.log("500 status error in onLoad function\n");
        }
    } catch (error) {
        console.log("Error in onLoad Function: \n " + error);
    }
};

const nextClick = async function () {
    try {
        const response = await fetch("http://" + URL + "/APL2019/webapi/player/getNextPlayer", {
            method: "GET",
            credentials: 'include'
        }).then(function(response){
            return response.json();
        });
        //console.log(JSON.stringify(response));
        jsonObject = JSON.parse(JSON.stringify(response));
        document.getElementById("name").innerHTML = jsonObject.firstName + " " + jsonObject.lastName;
        document.getElementById("playerImage").src = jsonObject.photo;

        //internal server error -- handle it @jatan
        if (response.status === 500) {
            console.log("500 status error in nextClick function\n");
        }

    } catch (error) {
        console.log("Error in nextClick Function: \n " + error);
    }
};

const getRadioVal = function (form, name) {
    let val;
    // get list of radio buttons with specified name
    let radios = form.elements[name];

    // loop through list of radio buttons
    for (let i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
};

Object.prototype.isEmpty = function () {
    for (let key in this) {
        if (this.hasOwnProperty(key))
            return false;
    }
    return true;
};

const validateCostTeamNextBtnResponse = function () {
    let teamName;
    let cost;
    teamName = getRadioVal(document.getElementById("team-names"), 'radio');
    cost = parseInt(document.getElementById("budget").value);
    if (jsonObject.isEmpty()) {
        throw new Error("Next Button Response is blank.")
    }
    if (teamName === undefined) {
        throw new Error("Select the team for the player.");
    }
    if (cost === "" || cost === 0 || isNaN(cost) || cost < 100) {
        throw new Error("Bid Amount should not be blank and less than 100.");
    }
    return {
        teamName,
        cost
    };
};

const validateEditPlayerData = function () {
    let teamName;
    let cost;
    teamName = document.getElementById('editedTeamName').value;
    cost = parseInt(document.getElementById("editPrice").value);
    if (teamName === undefined) {
        throw new Error("Select the team for the player.");
    }
    if (cost === "" || cost === 0 || isNaN(cost) || cost < 100 ) {
        throw new Error("Bid Amount should not be blank and less than 100.");
    }
    return {
        teamName,
        cost
    };
};

const createDataForSold = function () {
    const validatedCostAndTeam = validateCostTeamNextBtnResponse();
    const requestBody = jsonObject;
    requestBody.cost = validatedCostAndTeam.cost;
    requestBody.teamName = validatedCostAndTeam.teamName;
    //console.log(requestBody);
    return requestBody;
};

const sendSoldPlayerRequest = async jsonData => {
    try {
        await fetch("http://" + URL + "/APL2019/webapi/player/playerSold", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(jsonData)
        });
        // console.log(JSON.stringify(response));
        return true;
    } catch (error) {
        throw new Error("An unexpected error occurred\n" + error);

    }
};

const sendTeamPlayerRequest = async function(){
    try{
      const respose =   await fetch("http://" + URL + "/APL2019/webapi/team/getAllTeams", {
            method: "GET",
            credentials: 'include'
        }).then(function(response){
           // console.log(response.json());
            return response.json();
        });
      return respose;
    }
    catch (e) {
        throw new Error(e);
    }
};

const createEditPlayerData = function(player){
    const validatedCostAndTeam = validateEditPlayerData();
    player.cost = validatedCostAndTeam.cost;
    player.teamName = validatedCostAndTeam.teamName;
    player.isEdit = true;
    return player;
};

const openEditPlayerModal = function(player,team){
    // Get the modal
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    document.getElementById('editPrice').value = player.cost;
    document.getElementById('editName').innerHTML = player.firstName + " "+ player.lastName;
   // $("select option[value='"+team.teamName+"']").attr("selected","selected");
    editPlayerObject = player;
    console.log(player.firstName);
};

const closeEditPlayerModal = function(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
};
const removePlayerFromList = function(id){
    var elem = document.getElementById(id);
 elem.parentElement.removeChild(elem);
}
const editPlayer = async function(){
    event.preventDefault();
   
    try {
         const jsonData = createEditPlayerData(editPlayerObject);
        const hasPlayerSold = await sendSoldPlayerRequest(jsonData);
        if (hasPlayerSold) {
            // console.log("entered");
            alert("Player Information edited Successfully");
            closeEditPlayerModal();
            removePlayerFromList(jsonData.id);
            loadAllTeamPlayerInformation();

        }
    } catch (error) {
        alert(error);
        //console.log(error);
    }
};


const loadTeamListData = function(team, teamListElementByID) {
    let teamListTag = document.getElementById(teamListElementByID);
    if (team.myTeam) {
        let remainingBudget = defaultBudget;
        team.myTeam.forEach(function (player) {
            remainingBudget -= player.cost;
            if(!document.getElementById(player._id)){
                let li = document.createElement("li");
                li.setAttribute("id", player._id);
                li.appendChild(document.createTextNode(player.firstName + " " + player.lastName));
                li.onclick = function(){ openEditPlayerModal(player,team)};                
                teamListTag.appendChild(li);
            }
        });
        document.getElementById('rb-'+teamListElementByID).value = remainingBudget;
        document.getElementById('mb-'+teamListElementByID).value =
            team.myTeam.length === 11 ? 0 : remainingBudget - ((( 8 - (team.myTeam.length - 3)) - 1) * 100)
    }
};

const loadAllTeamPlayerInformation = async function () {
    const teamsPlayerResponse = await sendTeamPlayerRequest();
    teamsPlayerResponse.forEach(function (team) {
        // if in any case the name of the team changes in the backend
        // please also change the name over here.
        // Team names in the switch case should EXACTLY  match as that are in backend.
        // Second parameter is the team short-hand id in the HTML because as we are following
        // the tabular format, thus each coloumn is specifically dedicated to the respective team.
        // altough it is little bit unconventional method to do it but it saves lot of time in rendering
            switch (team.teamName) {
                case "Griffintown Warriors":
                    loadTeamListData(team,"gw");
                    break;
                case "TMR Supersonics":
                    loadTeamListData(team,"tmr");
                    break;
                case "Laval Titans":
                    loadTeamListData(team,"lt");
                    break;
                case "ParcEx Knight Riders":
                    loadTeamListData(team,"px");
                    break;
                case "West Island Mustangs":
                    loadTeamListData(team,"wim");
                    break;
                case "Verdun Vikings":
                    loadTeamListData(team,"vv");
                    break;
                case "Westmount Fury":
                    loadTeamListData(team,"wf");
                    break;
                case "Lachine Mavericks":
                    loadTeamListData(team,"lm");
                    break;
                case "Mont Royal Eagles":
                    loadTeamListData(team,"mre");
                    break;
                case "South Shore Lions":
                    loadTeamListData(team,"ssl");
                    break;
                case "Downtown Thunders":
                    loadTeamListData(team,"dt");
                    break;
                case "NDG Strikers":
                    loadTeamListData(team,"ndg");
                    break;
                default:
                    break;

            }
    })
};

const soldClick = async function () {
    try {
        const jsonData = createDataForSold();
        const hasPlayerSold = await sendSoldPlayerRequest(jsonData);
        if (hasPlayerSold) {
            // console.log("entered");
            alert("Player Auctioned Successfully");
            document.getElementById("costForm").reset();
            document.getElementById("team-names").reset();
            loadAllTeamPlayerInformation();

        }
    } catch (error) {
        alert(error);
        //console.log(error);
    }
};

const openPreviewForAudience = function(){
        window.open('preview.html',"_blank")
}