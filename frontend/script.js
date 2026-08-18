const txtbox=document.querySelector("#txt");
const list=document.querySelector("#list");
const addbutton=document.querySelector("#ad");
const username=document.querySelector("#username");
const logout=document.querySelector("#logout");
// const reminder=document.querySelector("#reminder");
const API=window.APP_CONFIG.API_URL;
const user_id=localStorage.getItem("user_id");
const user_name=localStorage.getItem("username");
if(!user_id){
    window.location.href="login.html";
}
if(username){
    username.textContent="Welcome "+user_name;
}
const createTask=(task)=>{
    const newli=document.createElement("li");
    newli.dataset.id=task.id;
    const taskText=document.createElement("span");
    taskText.textContent=task.title;
    if(task.status){
        newli.classList.add("done");
    }
    const buttonBox=document.createElement("div");
    buttonBox.className="task-buttons";
    const donebtn=document.createElement("button");
    donebtn.type="button";
    donebtn.textContent=task.status?"Undo":"Mark as Done";
    donebtn.addEventListener("click",()=>{
        fetch(`${API}/done/${task.id}?user_id=${user_id}`,{method:"PUT"})
        .then(response=>response.json())
        .then(()=>{
            if(newli.classList.contains("done")){
                newli.classList.remove("done");
                donebtn.textContent="Mark as Done";
            }else{
                newli.classList.add("done");
                donebtn.textContent="Undo";
            }
        })
        .catch(error=>console.log(error));
    });
    const editbtn=document.createElement("button");
    editbtn.type="button";
    editbtn.textContent="Edit";
    editbtn.addEventListener("click",()=>{
        const input=document.createElement("input");
        input.type="text";
        input.value=task.title;
        newli.replaceChild(input,taskText);
        input.focus();
        editbtn.textContent="Save";
        editbtn.onclick=()=>{
            const updatedTitle=input.value.trim();
            if(updatedTitle===""){return;}
            fetch(`${API}/edit/${task.id}?user_id=${user_id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({title:updatedTitle})
            })
            .then(response=>response.json())
            .then(()=>{
                task.title=updatedTitle;
                taskText.textContent=updatedTitle;
                newli.replaceChild(taskText,input);
                editbtn.textContent="Edit";
            })
            .catch(error=>console.log(error));
        };
    });
    const delbtn=document.createElement("button");
    delbtn.type="button";
    delbtn.textContent="Remove";
    delbtn.addEventListener("click",()=>{
        fetch(`${API}/delete/${task.id}?user_id=${user_id}`,{method:"DELETE"})
        .then(response=>response.json())
        .then(()=>{
            newli.classList.add("remove-animation");
            setTimeout(()=>{newli.remove();},500);
        })
        .catch(error=>console.log(error));
    });
    buttonBox.appendChild(donebtn);
    buttonBox.appendChild(editbtn);
    buttonBox.appendChild(delbtn);
    newli.appendChild(taskText);
    newli.appendChild(buttonBox);
    list.appendChild(newli);
};
const addtolist=()=>{
    if(txtbox.value.trim()===""){return;}
    fetch(`${API}/add`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title:txtbox.value,user_id:user_id})
    })
    .then(response=>response.json())
    .then(task=>{
        createTask(task);
        txtbox.value="";
        txtbox.focus();
    })
    .catch(error=>console.log(error));
};
const loadTasks=()=>{
    fetch(`${API}/tasks?user_id=${user_id}`)
    .then(response=>response.json())
    .then(tasks=>{
        list.innerHTML="";
        tasks.forEach(task=>{createTask(task);});
    })
    .catch(error=>console.log(error));
};
addbutton.addEventListener("click",addtolist);
txtbox.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"){
        event.preventDefault();
        addtolist();
    }
});
logout.addEventListener("click",()=>{
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    window.location.href="login.html";
});
loadTasks();