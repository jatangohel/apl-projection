let jsonObject;
//const URL = "192.168.31.34:8080";
const URL = "localhost:8080";

const onLoad = async function(){
    try {
        //@Jatan toggle next and sold button based on onLoad
        const response = await fetch("http://"+URL+"/APL2019/webapi/logger/login?email=akashshah.shah3@gmail.com&password=1234", {
            method: "GET",
            credentials: 'include'
        });
        //internal server error -- handle it @jatan
        if(response.status === 500){
            alert("OOOPS!!");
        }
    } catch(error) {
        alert("OOOPS!!");
        console.log(error);
    }
}
const nextClick = async function(){
    try{
        const response = await fetch("http://"+URL+"/APL2019/webapi/player/getNextPlayer", {
            method: "GET",
            credentials: 'include'
        }).then(function(response){
            return response.json();
        });
        console.log(JSON.stringify(response));
        jsonObject = JSON.parse(JSON.stringify(response));
        document.getElementById("name").innerHTML = jsonObject.firstName + " "+ jsonObject.lastName;
        document.getElementById("playerImage").src = jsonObject.photo;

        //internal server error -- handle it @jatan
        if(response.status === 500){
            alert("OOOPS!!");
        }

    } catch(error) {
        alert("OOOPS!!");
        console.log(error);
    }
}
const soldClick = async function(){
    try{
        jsonObject.cost = document.getElementById("budget").value;
        //@Jatan figure out the binding for teamName
        jsonObject.teamName = "Griffintown Warriors";

        let mainJSON = '{"player":'+JSON.stringify(jsonObject)+'}';

        console.log(mainJSON);

        const response = await fetch("http://"+URL+"/APL2019/webapi/player/playerSold", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: mainJSON
        }).then(function(response){
            return response.json();
        });
        console.log(JSON.stringify(response));

        //@Jatan toggle next and sold button based on this condition
        //internal server error -- handle it @jatan
        if(response.status === 500){
            alert("OOOPS!!");
        }

    } catch(error) {
        alert("OOOPS!!");
        console.log(error);
    }
}