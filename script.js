const addBtn = document.querySelector(".add-btn");
const modalContainer = document.querySelector(".modal-cont");
const mainContainer = document.querySelector(".main-cont");
const removeBtn = document.querySelector(".remove-btn");
const allPriorityColors = document.querySelectorAll(".priority-color");
const textArea = document.querySelector(".textArea-cont");
const toolboxColors = document.querySelectorAll(".color");
const lockClose = 'fa-lock';
const lockOpen = 'fa-lock-open';
const priorityColorsArr = ["lightpink", "lightgreen", "lightblue", "black"];
let ticketArr = JSON.parse(localStorage.getItem('tickets')) || [];

let allTickets = document.querySelectorAll(".ticket-cont");
let addBtnFlag = false;
let modalPriorityColor = "black";
let removeBtnActive = false;

//to load at rendering
function init() {
    if (localStorage.getItem('tickets')) {
        ticketArr.forEach(function (ticket) {
            console.log(ticket.ticketColor +"  " + ticket.ticketID +"  " + ticket.textValue);
            createTicket(ticket.ticketColor, ticket.ticketID, ticket.textValue);
        });
    }
}

init();

// add functionality to add btn
addBtn.addEventListener('click', function (e) {
    // console.log("inside addbtn event")
    addBtnFlag = !addBtnFlag;
    if (addBtnFlag == true) {
        modalContainer.style.display = "flex";
    }
    else {
        modalContainer.style.display = "none";
    }
});

// creating ticket

function createTicket(priorityColor, ticketID, taskInfo) {
    const ticketCont = document.createElement("div");
    ticketCont.setAttribute('class', 'ticket-cont');

    ticketCont.innerHTML = `<div class="ticket-color" style="background-color: ${priorityColor}"></div>
            <div class="ticket-id">${ticketID}</div>
            <div class="task-area">${taskInfo}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>`;

    mainContainer.appendChild(ticketCont);

    handleLock(ticketCont);
    handleTaskColorChange(ticketCont);
}

// creating/saving new task 

textArea.addEventListener("keydown", function (e) {
    const key = e.key;
    //save
    if (key === 'Shift') {
        const ticketID = Math.random().toString(36).substring(2, 8);
        const textValue = textArea.value;
        createTicket(modalPriorityColor, ticketID, textValue);
        ticketArr.push({ ticketColor: modalPriorityColor, ticketID, textValue });
        // localStorage.setItem('tickets', JSON.stringify(ticketArr));
        updateLocalStorage();
        modalContainer.style.display = "none";
        textArea.value = "";
        addBtnFlag = false;
    }
});



allPriorityColors.forEach(function (priorityColor) {

    priorityColor.addEventListener('click', function (e) {

        allPriorityColors.forEach(function (color) {
            color.classList.remove('active');
        });

        e.target.classList.add("active");
        modalPriorityColor = e.target.classList[0];
    });
});


//remove tickets
removeBtn.addEventListener('click', function (e) {

    removeBtnActive = !removeBtnActive;
    if (removeBtnActive) {
        alert("Delete button is activated");
        allTickets = document.querySelectorAll(".ticket-cont");
        // console.log(allTickets.length);
        allTickets.forEach(function (ticket) {
            handleRemovalTicket(ticket);
        });
        removeBtn.style.color = "red";
    }
    else {
        removeBtn.style.color = "white";
    }
});

function handleRemovalTicket(ticket) {
    const id = ticket.querySelector(".ticket-id").innerHTML;
    ticket.addEventListener('click', function (e) {
        if (removeBtnActive) {
            if (confirm("Are you sure you want to proceed?")) {
                ticket.remove();
                const ticketInd = getTicketInd(id);
                ticketArr.splice(ticketInd, 1);
                updateLocalStorage();
            }
        }
        else {
            return;
        }
    });
}

function getTicketInd(id){
    const tikcetIdx = ticketArr.findIndex(function (ticket) {
        return ticket.ticketID == id;
      });
      return tikcetIdx;
}

//handle Lock btn
function handleLock(ticket) {
    // console.log("clicked on lock");
    const lockEle = ticket.querySelector(".ticket-lock");
    const ticketLockIcon = lockEle.children[0];
    const ticketTextArea = ticket.querySelector(".task-area");
    const id = ticket.querySelector(".ticket-id").innerHTML;

    ticketLockIcon.addEventListener('click', function (e) {
        const ticketInd = getTicketInd(id);
        console.log(id);
        console.log(ticketInd);
        if (ticketLockIcon.classList.contains(lockClose)) {
            ticketLockIcon.classList.remove(lockClose);
            ticketLockIcon.classList.add(lockOpen);
            console.log(ticketTextArea.value);
            ticketTextArea.setAttribute("contenteditable", "true");
        }
        else {
            ticketLockIcon.classList.remove(lockOpen);
            ticketLockIcon.classList.add(lockClose);
            ticketTextArea.setAttribute('contenteditable', "false");
        }

        ticketArr[ticketInd].textValue = ticketTextArea.innerHTML;
        updateLocalStorage();
    });

}

//change task colors
function handleTaskColorChange(ticket) {
    const taskColor = ticket.querySelector(".ticket-color");
    const id = ticket.querySelector(".ticket-id").innerHTML;

    taskColor.addEventListener('click', function (e) {
        const currentColor = taskColor.style.backgroundColor;
        const ticketInd = getTicketInd(id);
        const currentColorInd = priorityColorsArr.findIndex(function (color) {
            return color === currentColor;
        });
        const newColorInd = (currentColorInd + 1) % priorityColorsArr.length;
        const newColor = priorityColorsArr[newColorInd];
        taskColor.style.backgroundColor = newColor;
        ticketArr[ticketInd].ticketColor = newColor;
        updateLocalStorage();
    });
}

//add filter on toolbox colors
toolboxColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function (e) {
        const selectedColor = colorElem.classList[0];
        allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(function (ticket) {
            const ticketBand = ticket.querySelector(".ticket-color");
            if (selectedColor === ticketBand.style.backgroundColor) {
                ticket.style.display = "block";
            }
            else {
                ticket.style.display = "none";
            }
        });
    });
    colorElem.addEventListener('dblclick', function (e) {
        allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(function (ticket) {
            ticket.style.display = "block";
        });
    });
});


function updateLocalStorage() {
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
}
