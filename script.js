import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATL5dBKS1l_JBoOsFjLWNCe3YU2PoQDf8",
  authDomain: "household-chores-e345a.firebaseapp.com",
  projectId: "household-chores-e345a",
  storageBucket: "household-chores-e345a.firebasestorage.app",
  messagingSenderId: "430200177655",
  appId: "1:430200177655:web:4711ccd99c6f8906d124f2",
  measurementId: "G-F7MFBGLKYY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let members = [];
let chores = [];
let tasks = [];

const membersRef = collection(db, "members");
const choresRef = collection(db, "chores");
const tasksRef = collection(db, "tasks");

window.addMember = async function () {
  const name = document.getElementById("memberInput").value.trim();

  if (name === "") {
    alert("Please enter a member name");
    return;
  }

  await addDoc(membersRef, {
    name: name
  });

  document.getElementById("memberInput").value = "";
};

window.addChore = async function () {
  const chore = document.getElementById("choreInput").value.trim();

  if (chore === "") {
    alert("Please enter a chore name");
    return;
  }

  await addDoc(choresRef, {
    name: chore
  });

  document.getElementById("choreInput").value = "";
};

window.assignTask = async function () {
  if (members.length === 0 || chores.length === 0) {
    alert("Please add at least one member and one chore first");
    return;
  }

  await addDoc(tasksRef, {
    chore: document.getElementById("choreSelect").value,
    member: document.getElementById("memberSelect").value,
    day: document.getElementById("daySelect").value,
    done: false
  });
};

window.markDone = async function (id) {
  const taskDoc = doc(db, "tasks", id);

  await updateDoc(taskDoc, {
    done: true
  });
};

window.deleteTask = async function (id) {
  const taskDoc = doc(db, "tasks", id);
  await deleteDoc(taskDoc);
};

function updateSelects() {
  const memberSelect = document.getElementById("memberSelect");
  const choreSelect = document.getElementById("choreSelect");

  memberSelect.innerHTML = "";
  choreSelect.innerHTML = "";

  members.forEach(function (member) {
    const option = document.createElement("option");
    option.textContent = member.name;
    option.value = member.name;
    memberSelect.appendChild(option);
  });

  chores.forEach(function (chore) {
    const option = document.createElement("option");
    option.textContent = chore.name;
    option.value = chore.name;
    choreSelect.appendChild(option);
  });
}

function showTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const div = document.createElement("div");
    div.className = "task";

    if (task.done) {
      div.classList.add("done");
    }

    div.innerHTML = `
      <strong>${task.chore}</strong><br>
      Assigned to: ${task.member}<br>
      Day: ${task.day}<br>
      Status: ${task.done ? "Done" : "Pending"}<br>
      <button onclick="markDone('${task.id}')">Mark Done</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;

    taskList.appendChild(div);
  });
}

onSnapshot(membersRef, function (snapshot) {
  members = [];

  snapshot.forEach(function (doc) {
    members.push({
      id: doc.id,
      ...doc.data()
    });
  });

  updateSelects();
});

onSnapshot(choresRef, function (snapshot) {
  chores = [];

  snapshot.forEach(function (doc) {
    chores.push({
      id: doc.id,
      ...doc.data()
    });
  });

  updateSelects();
});

onSnapshot(tasksRef, function (snapshot) {
  tasks = [];

  snapshot.forEach(function (doc) {
    tasks.push({
      id: doc.id,
      ...doc.data()
    });
  });

  showTasks();
});