let jsonObject = {};
const URL = "localhost:8080";

const onLoad = async function () {
    try {
        const response = await fetch("http://" + URL + "/APL2019/webapi/logger/login?email=akashshah.shah3@gmail.com&password=1234", {
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
        throw new Error("Next Button Response is blank;")
    }
    if (teamName === undefined) {
        throw new Error("Select the team for the player");
    }
    if (cost === "" || cost === 0 || isNaN(cost) || cost < 100) {
        throw new Error("Enter the cost of the player");
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

const loadTeamListData = function(team, teamListElementByID) {
    let teamListTag = document.getElementById(teamListElementByID);
    if (team.myTeam) {
        team.myTeam.forEach(function (player) {
            if(!document.getElementById(player.id)){
                let li = document.createElement("li");
                li.setAttribute("id", player.id);
                li.appendChild(document.createTextNode(player.firstName + " " + player.lastName));
                teamListTag.appendChild(li);
            }
        })
    }
};

const loadAllTeamPlayerInformation = async function () {
    const teamsPlayerResponse = await sendTeamPlayerRequest();
    teamsPlayerResponse.forEach(function (team) {
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