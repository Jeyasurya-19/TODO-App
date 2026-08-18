const registerBtn=document.querySelector("#registerBtn");


registerBtn.addEventListener("click",()=>{

    const username=document.querySelector("#username").value;

    const email=document.querySelector("#email").value;

    const password=document.querySelector("#password").value;


    fetch(`${window.APP_CONFIG.API_URL}/register`,
    {
        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:username,
            email:email,
            password:password

        })
    })

    .then(response=>{
        if(!response.ok){
            throw Error("Server Error");
        }
        return response.json();
    })
    .then(data=>{

        alert(data.message);

        window.location.href="login.html";

    });

});