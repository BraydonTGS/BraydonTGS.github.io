let audioCtx; // global AudioContext
let time = 1500;
let timer = null;
let tasks = JSON.parse(localStorage.getItem("tasks")||"[]");

// TIMER
function updateDisplay() {
  let m = Math.floor(time/60);
  let s = time%60;
  document.getElementById("time").innerText = m + ":" + (s<10?"0"+s:s);
}

function playBeep() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

function startTimer() {
  if(timer) return;
  timer = setInterval(()=>{
    time--;
    updateDisplay();
    if(time<=0){
      clearInterval(timer);
      timer=null;
      completeSession();
      alert("🔥 Session Complete");
    }
  },1000);
}

function pauseTimer() { clearInterval(timer); timer=null; }
function resetTimer() { clearInterval(timer); timer=null; time=1500; updateDisplay(); }
function toggleFocus() { document.body.classList.toggle("focus"); }

// TASKS
function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((t,i)=>{
    let li = document.createElement("li");
    li.innerText = t;
    li.onclick = ()=>{ tasks.splice(i,1); save(); };
    list.appendChild(li);
  });
}

function addTask(){
  let input = document.getElementById("taskInput");
  if(!input.value) return;
  tasks.push(input.value);
  input.value="";
  save();
}

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// STATS
function updateStats() {
  let today = new Date().toDateString();
  let sessions = JSON.parse(localStorage.getItem("sessions")||"{}");
  document.getElementById("sessions").innerText = sessions[today] || 0;

  let streak=0;
  let d=new Date();
  while(true){
    if(sessions[d.toDateString()]) { streak++; d.setDate(d.getDate()-1); } 
    else break;
  }
  document.getElementById("streak").innerText = streak;
}

function completeSession(){
  playBeep();
  let today = new Date().toDateString();
  let sessions = JSON.parse(localStorage.getItem("sessions")||"{}");
  if(!sessions[today]) sessions[today]=0;
  sessions[today]++;
  localStorage.setItem("sessions", JSON.stringify(sessions));
  updateStats();
}

// INIT: only update UI on load, don't play sound
updateDisplay();
renderTasks();
updateStats();
