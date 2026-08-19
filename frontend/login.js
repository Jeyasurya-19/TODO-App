const loginBtn=document.querySelector("#loginBtn");

document.querySelector("#loginForm").addEventListener("submit",(e)=>{

    e.preventDefault();

    const email=document.querySelector("#email").value;
    const password=document.querySelector("#password").value;

    fetch(`${window.APP_CONFIG.API_URL}/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email,
            password:password
        })
    })
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        alert(data.message);
        if(data.user_id){
            localStorage.setItem("user_id",data.user_id);
            localStorage.setItem("username",data.username);
            window.location.href="index.html";
        }
    })
    .catch(error=>{
        console.log(error);
        alert("Login failed");
    });
});

const toggle=document.querySelector("#togglePassword");
const password=document.querySelector("#password");

toggle.addEventListener("click",()=>{

    if(password.type==="password"){
        password.type="text";
        toggle.textContent="🙈";
    }
    else{
        password.type="password";
        toggle.textContent= &#x1F441;
    }

});
