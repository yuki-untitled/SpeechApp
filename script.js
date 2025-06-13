// 🎤 音声認識
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sr = new SpeechRecognition();
sr.interimResults = true;
sr.continuous = true;

const start = document.getElementById("startButton");
const end = document.getElementById("endButton");
const log = document.getElementById("textLog");

let logText = "";

sr.addEventListener("result", function(e) {
  let interimTranscript = "";

  for (let i = e.resultIndex; i < e.results.length; i++) {
    const transcript = e.results[i][0].transcript.trim();
    if (e.results[i].isFinal) {
      if (transcript !== "") {
        logText += transcript + "\n";
      }
    } else {
      interimTranscript += transcript;
    }
  }

  log.innerText = logText + interimTranscript;
});

start.addEventListener("click", function() {
  logText = "";
  log.innerText = "";
  sr.start();
  start.disabled = true;
  end.disabled = false;
});

end.addEventListener("click", function() {
  sr.stop();
  start.disabled = false;
  end.disabled = true;
});

// 🔊 音声合成
const ipt = document.getElementById("inputArea");
const btn = document.getElementById("speakButton");

btn.addEventListener("click", function() {
  const uttr = new SpeechSynthesisUtterance(ipt.value);
  speechSynthesis.speak(uttr);
});

// 🔍 誤認識率の計算
const sd = document.getElementById("sendButton");
const sendForAnalysis = (text1, text2) => {
  fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text1, text2 })
  })
  .then(res => res.json())
  .then(data => {
    const log = document.getElementById("logArea");
    log.innerHTML = `
      <h3>スコア結果</h3>
      <p>CER: ${data.cer.toFixed(3)}</p>
      <p>WER: ${data.wer.toFixed(3)}</p>
      <p>BLEU: ${data.bleu.toFixed(3)}</p>
    `;
  })
  .catch(err => {
    console.error("分析APIエラー:", err);
  });
};

sd.addEventListener("click", function () {
  const inputText = document.getElementById("inputArea").value;
  const recognizedText = document.getElementById("textLog").innerText;

  // ここで関数に投げる！
  sendForAnalysis(inputText, recognizedText);
});