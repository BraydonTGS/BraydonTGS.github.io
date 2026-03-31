let time = 1500;
let timer;
let running = false;

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById("time").innerText =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (running) return;
  running = true;

  timer = setInterval(() => {
    time--;
    updateDisplay();

    if (time <= 0) {
      clearInterval(timer);
      alert("Done! Take a break.");
      running = false;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  running = false;
}

function resetTimer() {
  clearInterval(timer);
  time = 1500;
  running = false;
  updateDisplay();
}

// TASKS
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.innerText = task;
    li.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
    };
    list.appendChild(li);
  });
}

function addTask() {
  let input = document.getElementById("taskInput");
  if (!input.value) return;

  tasks.push(input.value);
  input.value = "";
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

updateDisplay();
renderTasks();
