let audioCtx;
function playBeep() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = "sine";
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}
