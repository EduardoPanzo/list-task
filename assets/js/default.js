let userActive,listActive,typeToAdd;

const select = document.querySelector('#accountType');
const home = document.querySelector('.home.container');
const passwordInput = document.querySelector('.user-selected #password');
const passwordView = document.querySelector('.user-selected .passwordView');
const buttonLogin = document.querySelector(".home #logIn");

const listsTask = document.querySelector('.listsTask.container')
const lists = listsTask.querySelector('.lists-body .lists');

const tasksTamplete = document.querySelector('.tasks.container');

const modalInput = document.querySelector('.modalInput');
const modelsArea = document.querySelector('.modelsArea');

let userSelves = [
    {id:1,name:'Jordam Machael',password:'JM1',urlImg:'.../../media/homem.png'},
    {id:2,name:'Miguel Eduardo',password:'ME2',urlImg:'.../../media/homem1.png'},
    {id:3,name:'Pedro Anfré',password:'PA3',urlImg:'.../../media/homem2.png'},
    {id:4,name:'Nami Helena',password:'NH4',urlImg:'.../../media/mulher1.png'},
    {id:5,name:'Carolina Maria',password:'CM5',urlImg:'.../../media/mulher2.png'}
];

let allListTask = localStorage.getItem('allLists')?
    JSON.parse(localStorage.getItem('allLists')):[];


function goToHome(){
    listsTask.style.display = 'none';
    home.style.display = 'flex';
}

function CreateNewUserSelf({name,password,urlImg}) {
    const newUserSelf = new UserSelf(name,password,urlImg);
    userSelves.push(newUserSelf)

    updateUserSelves()
}

function removeUserSelf(selfId) {
    userSelves = userSelves.filter(self=>self.id !== selfId);
    const selfListsTask = allListTask.filter(list=>list.userRef === selfId);

    selfListsTask.forEach(list=>removeList(list));

    updateUserSelves();
}

function updateUserSelves(){
    localStorage.setItem('userSelves',JSON.stringify(userSelves));
    mountUserSelvesIntoSelect();
}

function mountUserSelvesIntoSelect() {
    select.innerHTML = `
        <option disabled selected>
            Selecione Uma Conta
        </option>
    `;
    
    userSelves.map(user=>{
        const userOption = document.createElement('option');
        userOption.setAttribute('value',user.id);
        userOption.innerHTML = user.name;
    
        select.append(userOption)
    })
}

function enableUser(user){
    userActive = user;
    mountUserActive(userActive);
}

function mountUserActive(user) {
    home.querySelector('.user-img img').src = `${user.urlImg}`;
    home.querySelector('.user--name').innerHTML = `${user.name}`;

    listsTask.querySelector('.user--img img').src = user.urlImg;
    listsTask.querySelector('.user--name').innerHTML = user.name;
}

//Validar a Entrada no password....
function confirmUser(user,password) {
    if(user.password === password){
        goToList(user)
        return;
    }
    showPassword();
}
//A partir do login ir na segundo pagina 'lists'
function goToList(){
    home.style.display = 'none';
    tasksTamplete.style.display = 'none';
    listsTask.style.display = 'block';

    updateList()
}

function showPassword() {
    passwordView.innerHTML = `A senha é: ${userActive.password}`;
    passwordView.style.opacity = '1';
}

function updateList() {
    localStorage.setItem('allLists',JSON.stringify(allListTask));
    assembleList(userActive.id);
}

//Carregar a coleção de tarefas do usuario Activo
function assembleList(userId) {
    lists.innerHTML = ``;
    
    allListTask.filter(list=>list.userRef===userId)
        .map(userList=>{
            const listItem = modelsArea.querySelector('.list').cloneNode(true);

            listItem.querySelector('.list--name').innerHTML = userList.title;
            listItem.querySelector('.list--numberTask')
                .innerHTML = userList.tasks.length;
            
            listItem.addEventListener('click',(e)=>{
                if(e.target.tagName==='BUTTON'){
                    removeList(userList);
                    return;
                }
                listActive = userList;
                goToTasks(listActive)
            });

        lists.append(listItem);
    });
    
}

function removeList(userList) {
    allListTask = allListTask.filter(list=>list.id !== userList.id);
    updateList();
}

function goToTasks({title,tasks}) {
    listsTask.style.display = 'none';
    tasksTamplete.style.display = 'block';

    tasksTamplete.querySelector('.tasks--name')
        .innerHTML = title;

    assembleTasks(tasks);
}

function assembleTasks(tasks) {
    tasksTamplete.querySelector('.tasks-body').innerHTML='';
    
    tasks.forEach(task=>{
        const taskItem = modelsArea.querySelector('.task').cloneNode(true);
        
        taskItem.classList.add(task.status?`task-done`:`task-to-do`)
        
        taskItem.querySelector('.task--name')
            .innerHTML = task.name;
        taskItem.querySelector('.task--status')
            .innerHTML = task.status?`✔`:`⚫`;
        
        taskItem.addEventListener('click',(e)=>{
            // eliminar uma tasks
            if(e.target.matches('button.delete-task')){
                removeTask(task.id)
                return;
            } 

            //mudar o status da tarefa
            makeTaskDone(task.id);

        });

        tasksTamplete.querySelector('.tasks-body')
            .append(taskItem);
    });
}

function removeTask(taskId) {
    const newTasks = listActive.tasks.filter(task=> task.id !== taskId);
    
    updateCurrentListTasks(newTasks)
}

function makeTaskDone(taskId) {
    const newTasks = listActive.tasks.map(task=>{
        if (task.id === taskId) {
            return {
                ...task,
                status:!task.status
            }
        }

        return task;
    });
    
    updateCurrentListTasks(newTasks)
}

function updateCurrentListTasks(newTasks) {
    listActive.tasks = newTasks

    allListTask = allListTask.map(listTask=>{
        if (listTask.id === listActive.id) {
            return {...listActive}
        }

        return listTask
    })

    updateList()
    
    assembleTasks(listActive.tasks);
}