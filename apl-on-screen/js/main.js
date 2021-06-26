let jsonObject = {};
const URL = "apl2019.cfapps.us10.hana.ondemand.com";
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
                li.appendChild(document.createTextNode("\u2022" + " " + player.firstName + " " + player.lastName));
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
            case "Atmiya Avengers":
                loadTeamListData(team, "aa");
                break;
            case "Dasatva Dazzlers":
                loadTeamListData(team, "dd");
                break;
            case "Samp Super Kings":
                loadTeamListData(team, "ssk");
                break;
            case "Suhradbhav Strikers":
                loadTeamListData(team, "ss");
                break;
            default:
                break;

        }
    })
};
