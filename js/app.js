let audioCtx; // global AudioContext
// TIMER
let time = 1500;
let timer = null;

function updateDisplay() {
  let m = Math.floor(time/60);
  let s = time%60;
  document.getElementById("time").innerText =
    m + ":" + (s<10?"0"+s:s);
}
  
function completeSession() {
  playBeep();

  let today = new Date().toDateString();
  let sessions = JSON.parse(localStorage.getItem("sessions")||"{}");

  if(!sessions[today]) sessions[today]=0;
  sessions[today]++;

  localStorage.setItem("sessions", JSON.stringify(sessions));

  updateStats();
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

function pauseTimer(){
  clearInterval(timer);
  timer=null;
}

function resetTimer(){
  clearInterval(timer);
  timer=null;
  time=1500;
  updateDisplay();
}

// TASKS
let tasks = JSON.parse(localStorage.getItem("tasks")||"[]");

function renderTasks(){
  let list = document.getElementById("taskList");
  list.innerHTML="";

  tasks.forEach((t,i)=>{
    let li=document.createElement("li");
    li.innerText=t;
    li.onclick=()=>{
      tasks.splice(i,1);
      save();
    };
    list.appendChild(li);
  });
}

function addTask(){
  let input=document.getElementById("taskInput");
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
function updateStats(){
  let today = new Date().toDateString();
  let sessions = JSON.parse(localStorage.getItem("sessions")||"{}");

  document.getElementById("sessions").innerText =
    sessions[today] || 0;

  // streak
  let streak=0;
  let d=new Date();

  while(true){
    let key=d.toDateString();
    if(sessions[key]){
      streak++;
      d.setDate(d.getDate()-1);
    } else break;
  }

  document.getElementById("streak").innerText=streak;
}

// FOCUS MODE
function toggleFocus(){
  document.body.classList.toggle("focus");
}

// PWA (installable)
if ('serviceWorker' in navigator) {
  const blob = new Blob([`
    self.addEventListener('fetch', e => {
      e.respondWith(fetch(e.request));
    });
  `], { type: 'text/javascript' });

  const swURL = URL.createObjectURL(blob);
  navigator.serviceWorker.register(swURL);
}
function playBeep() {
  // Only create AudioContext on first user gesture
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Create oscillator + gain
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, audioCtx.currentTime); // beep frequency
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);     // volume

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2); // 200ms beep
}

//Init
updateDisplay();
renderTasks();
updateStats();
