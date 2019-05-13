let jsonObject = {};
const URL = "apl2019p1943019174trial.hanatrial.ondemand.com";
let editPlayerObject = {};
let defaultBudget = 16000;
 
const loadTeamListData = function (team, teamListElementByID) {
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
                teamListTag.appendChild(li);
            }
        });
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
};
