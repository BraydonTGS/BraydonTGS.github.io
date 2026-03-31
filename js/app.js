let audioCtx; // global AudioContext

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
