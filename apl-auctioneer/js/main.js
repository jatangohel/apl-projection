let jsonObject = {};
const URL = "apl2019.cfapps.us10.hana.ondemand.com";
let editPlayerObject = {};
let defaultBudget = 20000;

const onLoad = async function () {
    try {
        const response = await fetch("https://" + URL + "/APL2019/webapi/logger/login?email=tejas0904@gmail.com&password=1993", {
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
    document.getElementById("sold-btn").disabled = true;


};

const nextClick = async function () {
    try {
        const response = await fetch("https://" + URL + "/APL2019/webapi/player/getNextPlayer", {
            method: "GET",
            credentials: 'include'
        }).then(function (response) {
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
        document.getElementById("next-btn").disabled = true;
        document.getElementById("preview-btn").disabled = true;
        document.getElementById("sold-btn").disabled = false;

    } catch (error) {
        alert("There is no player left for auction !");
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
    document.getElementById("sold-btn").disabled = true;

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
    if (cost === "" || cost === 0 || isNaN(cost) || cost < 100) {
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
        await fetch("https://" + URL + "/APL2019/webapi/player/playerSold", {
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

const sendTeamPlayerRequest = async function () {
    try {
        const respose = await fetch("https://" + URL + "/APL2019/webapi/team/getAllTeams", {
            method: "GET",
            credentials: 'include'
        }).then(function (response) {
            // console.log(response.json());
            return response.json();
        });
        return respose;
    } catch (e) {
        throw new Error(e);
    }
};

const createEditPlayerData = function (player) {
    const validatedCostAndTeam = validateEditPlayerData();
    player.cost = validatedCostAndTeam.cost;
    player.teamName = validatedCostAndTeam.teamName;
    player.isEdit = true;
    return player;
};

const openEditPlayerModal = function (player, team) {
    // Get the modal
    let modal = document.getElementById('myModal');
    modal.style.display = "block";
    document.getElementById('editPrice').value = player.cost;
    document.getElementById('editName').innerHTML = player.firstName + " " + player.lastName;
    // $("select option[value='"+team.teamName+"']").attr("selected","selected");
    editPlayerObject = player;
};

const closeEditPlayerModal = function () {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
};

const removePlayerFromList = function (id) {
    let elem = document.getElementById(id);
    elem.parentElement.removeChild(elem);
};

const editPlayer = async function () {
    event.preventDefault();

    try {
        const jsonData = createEditPlayerData(editPlayerObject);
        const hasPlayerSold = await sendSoldPlayerRequest(jsonData);
        if (hasPlayerSold) {
            // console.log("entered");
            alert("Player Information edited Successfully");
            closeEditPlayerModal();
            removePlayerFromList(jsonData._id);
            loadAllTeamPlayerInformation();

        }
    } catch (error) {
        alert(error);
        //console.log(error);
    }
};

const loadTeamListData = function (team, teamListElementByID, teamRadioButtonID) {
    let teamListTag = document.getElementById(teamListElementByID);
    if (team.myTeam) {
        let remainingBudget = defaultBudget;
        team.myTeam.forEach(function (player, i) {
            remainingBudget -= player.cost;
            if (!document.getElementById(player._id)) {
                let li = document.createElement("li");
                li.setAttribute("id", player._id);
               // li.appendChild(document.createTextNode(player.firstName + " " + player.lastName));
                li.appendChild(document.createTextNode("\u2022" + " "+player.firstName + " " + player.lastName));
                if(!player.role){
                    li.onclick = function () {
                        openEditPlayerModal(player, team)
                    };
                }

                teamListTag.appendChild(li);
            }
        });
        document.getElementById('rb-' + teamListElementByID).value = remainingBudget;
        document.getElementById('mb-' + teamListElementByID).value =
            team.myTeam.length === 11 ? 0 : remainingBudget - (((8 - (team.myTeam.length - 3)) - 1) * 100);
        document.getElementById('rank-'+teamListElementByID).innerHTML = team.myTeam.length;
        if(team.myTeam.length === 11){
            document.getElementById(teamRadioButtonID).disabled = true;
        }
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
            case teamsPlayerResponse:
                loadTeamListData(team, "gw", "griffintown_warriors");
                break;
            case "TMR Supersonics":
                loadTeamListData(team, "tmr", "tmr_supersonics");
                break;
            case "Laval Titans":
                loadTeamListData(team, "lt", "laval_titans");
                break;
            case "ParcEx Knight Riders":
                loadTeamListData(team, "px", "knight_riders");
                break;
            case "West Island Mustangs":
                loadTeamListData(team, "wim", "west_island_mustangs");
                break;
            case "Verdun Vikings":
                loadTeamListData(team, "vv", "verdun_vikings");
                break;
            case "Westmount Fury":
                loadTeamListData(team, "wf", "westmount_fury");
                break;
            case "Lachine Mavericks":
                loadTeamListData(team, "lm", "lachine_mavericks");
                break;
            case "Mont Royal Eagles":
                loadTeamListData(team, "mre", "mont_royal_eagles");
                break;
            case "South Shore Lions":
                loadTeamListData(team, "ssl", "south_shore_lions");
                break;
            case true:
                loadTeamListData(team, "dt", "downtown_thunders");
                break;
            case "NDG Strikers":
                loadTeamListData(team, "ndg", "ndg_strikers");
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

    document.getElementById("next-btn").disabled = false;
    document.getElementById("preview-btn").disabled = false;
};

const openPreviewForAudience = function () {
    try {
        const response = fetch("https://" + URL + "/APL2019/webapi/team/preview", {
            method: "GET",
            credentials: 'include'
        });
        //internal server error -- handle it @jatan
        if (response.status === 500) {
            alert("500 status error in preview API");
        }
    } catch (error) {
        alert("Error in preview Function: \n " + error);
    }
};