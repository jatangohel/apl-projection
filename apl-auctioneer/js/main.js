const nextClick = async function(){
    try {
        console.log("request");
            const response = await fetch("http://localhost:8080/APL2019/webapi/getNextPlayer", {
              method: "GET",
             });
             console.log(response);
             let jsonObject = JSON.parse(response);

           //internal server error -- handle it @jatan
           if(response.status === 500){
            alert("OOOPS!!");
           }
           
        } catch(error) {
            alert("OOOPS!!");   
            console.log(error);
        }
}