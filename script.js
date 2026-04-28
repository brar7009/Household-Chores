let members = JSON.parse(localStorage.getItem("members")) || [];
let chores = JSON.parse(localStorage.getItem("chores")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("chores", JSON.stringify(chores));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addMember() {
  let name = document.getElementById("memberInput").value;

  if (name === "") {
    alert("Please enter a member name");
    return;
  }

  members.push(name);
  document.getElementById("memberInput").value = "";

  saveData();
  updateSelects();
}

function addChore() {
  let chore = document.getElementById("choreInput").value;

  if (chore === "") {
    alert("Please enter a chore name");
    return;
  }

  chores.push(chore);
  document.getElementById("choreInput").value = "";

  saveData();
  updateSelects();
}

function updateSelects() {
  let memberSelect = document.getElementById("memberSelect");
  let choreSelect = document.getElementById("choreSelect");

  memberSelect.innerHTML = "";
  choreSelect.innerHTML = "";

  members.forEach(function(member) {
    let option = document.createElement("option");
    option.textContent = member;
    memberSelect.appendChild(option);
  });

  chores.forEach(function(chore) {
    let option = document.createElement("option");
    option.textContent = chore;
    choreSelect.appendChild(option);
  });
}

function assignTask() {
  if (members.length === 0 || chores.length === 0) {
    alert("Please add at least one member and one chore first");
    return;
  }

  let task = {
    chore: document.getElementById("choreSelect").value,
    member: document.getElementById("memberSelect").value,
    day: document.getElementById("daySelect").value,
    done: false
  };

  tasks.push(task);

  saveData();
  showTasks();
}

function markDone(index) {
  tasks[index].done = true;

  saveData();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveData();
  showTasks();
}

function showTasks() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(function(task, index) {
    let div = document.createElement("div");
    div.className = "task";

    if (task.done) {
      div.classList.add("done");
    }

    div.innerHTML = `
      <strong>${task.chore}</strong><br>
      Assigned to: ${task.member}<br>
      Day: ${task.day}<br>
      Status: ${task.done ? "Done" : "Pending"}<br>
      <button onclick="markDone(${index})">Mark Done</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(div);
  });
}

updateSelects();
showTasks();