// Configuration
const FLASK_SERVER = "http://localhost:5000";

// Device state management
const deviceStates = {
  bedroom: { light: false, fan: false },
  garage: { light: false, fan: false },
  office: { light: false, fan: false },
};

// LED mapping
const ledMapping = {
  bedroom: { light: "LED1", fan: "LED2" },
  garage: { light: "LED3", fan: "LED4" },
  office: { light: "LED5", fan: "LED6" },
};

// Voice recognition state management
const voiceState = {
  "text-input": { recognition: null, isRecording: false, silenceTimer: null },
  "morse-input": { recognition: null, isRecording: false, silenceTimer: null },
  "braille-input": {
    recognition: null,
    isRecording: false,
    silenceTimer: null,
  },
  "home-command-input": {
    recognition: null,
    isRecording: false,
    silenceTimer: null,
  },
};

// Morse code dictionary
const morseCode = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  " ": "/",
};

// Braille patterns
const braillePatterns = {
  A: [1, 0, 0, 0, 0, 0],
  B: [1, 0, 1, 0, 0, 0],
  C: [1, 1, 0, 0, 0, 0],
  D: [1, 1, 0, 1, 0, 0],
  E: [1, 0, 0, 1, 0, 0],
  F: [1, 1, 1, 0, 0, 0],
  G: [1, 1, 1, 1, 0, 0],
  H: [1, 0, 1, 1, 0, 0],
  I: [0, 1, 1, 0, 0, 0],
  J: [0, 1, 1, 1, 0, 0],
  K: [1, 0, 0, 0, 1, 0],
  L: [1, 0, 1, 0, 1, 0],
  M: [1, 1, 0, 0, 1, 0],
  N: [1, 1, 0, 1, 1, 0],
  O: [1, 0, 0, 1, 1, 0],
  P: [1, 1, 1, 0, 1, 0],
  Q: [1, 1, 1, 1, 1, 0],
  R: [1, 0, 1, 1, 1, 0],
  S: [0, 1, 1, 0, 1, 0],
  T: [0, 1, 1, 1, 1, 0],
  U: [1, 0, 0, 0, 1, 1],
  V: [1, 0, 1, 0, 1, 1],
  W: [0, 1, 1, 1, 0, 1],
  X: [1, 1, 0, 0, 1, 1],
  Y: [1, 1, 0, 1, 1, 1],
  Z: [1, 0, 0, 1, 1, 1],
  0: [0, 1, 0, 1, 1, 0],
  1: [0, 1, 0, 0, 0, 0],
  2: [0, 1, 1, 0, 0, 0],
  3: [0, 1, 0, 0, 1, 0],
  4: [0, 1, 0, 0, 1, 1],
  5: [0, 1, 0, 1, 0, 0],
  6: [0, 1, 1, 0, 1, 0],
  7: [0, 1, 1, 0, 1, 1],
  8: [0, 1, 0, 1, 1, 0],
  9: [0, 1, 0, 1, 0, 0],
  " ": [0, 0, 0, 0, 0, 0],
};

const brailleUnicode = {
  A: "⠁",
  B: "⠃",
  C: "⠉",
  D: "⠙",
  E: "⠑",
  F: "⠋",
  G: "⠛",
  H: "⠓",
  I: "⠊",
  J: "⠚",
  K: "⠅",
  L: "⠇",
  M: "⠍",
  N: "⠝",
  O: "⠕",
  P: "⠏",
  Q: "⠟",
  R: "⠗",
  S: "⠎",
  T: "⠞",
  U: "⠥",
  V: "⠧",
  W: "⠺",
  X: "⠭",
  Y: "⠽",
  Z: "⠵",
  " ": " ",
};

// Modal functions
function openModal(id) {
  document.getElementById(id).style.display = "block";
  if (id === "home-automation") {
    updateDeviceUI();
  }
}

function closeModal(id) {
  const inputIds = {
    "morse-encode": "text-input",
    "morse-decode": "morse-input",
    "braille-translate": "braille-input",
    "home-automation": "home-command-input",
  };
  if (inputIds[id]) stopVoiceRecording(inputIds[id]);
  document.getElementById(id).style.display = "none";
}

window.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id);
  }
};

// Voice recording functions
function toggleVoiceRecording(textareaId) {
  const state = voiceState[textareaId];
  state.isRecording
    ? stopVoiceRecording(textareaId)
    : startVoiceRecording(textareaId);
}

function startVoiceRecording(textareaId) {
  const state = voiceState[textareaId];
  const idMap = {
    "text-input": {
      mic: "mic-btn-text",
      status: "status-text",
      stop: "stop-btn-text",
      viz: "visualizer-text",
    },
    "morse-input": {
      mic: "mic-btn-morse",
      status: "status-morse",
      stop: "stop-btn-morse",
      viz: "visualizer-morse",
    },
    "braille-input": {
      mic: "mic-btn-braille",
      status: "status-braille",
      stop: "stop-btn-braille",
      viz: "visualizer-braille",
    },
    "home-command-input": {
      mic: "mic-btn-home",
      status: "status-home",
      stop: "stop-btn-home",
      viz: "visualizer-home",
    },
  };

  const ids = idMap[textareaId];
  if (!ids || !("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported. Use Chrome or Edge.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  const elements = {
    textarea: document.getElementById(textareaId),
    micBtn: document.getElementById(ids.mic),
    status: document.getElementById(ids.status),
    stopBtn: document.getElementById(ids.stop),
    visualizer: document.getElementById(ids.viz),
  };

  elements.micBtn.classList.add("listening");
  elements.status.classList.add("listening");
  elements.status.textContent = '🎙️ Listening... (say "force stop" to end)';
  elements.stopBtn.disabled = false;
  elements.visualizer.classList.add("active");

  state.isRecording = true;
  state.recognition = recognition;

  let lastSpeechTime = Date.now();

  recognition.onresult = (event) => {
    lastSpeechTime = Date.now();
    if (state.silenceTimer) {
      clearTimeout(state.silenceTimer);
      state.silenceTimer = null;
    }

    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }

    const fullTranscript = (finalTranscript + interimTranscript).toLowerCase();
    if (
      fullTranscript.includes("force stop") ||
      fullTranscript.includes("forcestop")
    ) {
      stopVoiceRecording(textareaId, true);
      return;
    }

    if (textareaId === "morse-input") {
      if (finalTranscript) {
        const tokens = finalTranscript
          .toLowerCase()
          .split(/\s+/)
          .map((word) => {
            if (word === "dot" || word === "dots") return ".";
            if (word === "dash" || word === "dashes") return "-";
            if (word === "space" || word === "spaces") return " ";
            return "";
          })
          .filter((token) => token !== "")
          .join("");
        elements.textarea.value += tokens;
      }
    } else {
      if (finalTranscript) {
        const currentText = elements.textarea.value;
        const newText =
          currentText + (currentText ? " " : "") + finalTranscript.trim();
        elements.textarea.value = newText;
      }
    }

    if (interimTranscript) {
      elements.status.textContent = `🎙️ ${interimTranscript}`;
    }

    state.silenceTimer = setTimeout(() => {
      if (Date.now() - lastSpeechTime >= 3000) {
        stopVoiceRecording(textareaId, true);
      }
    }, 5000);
  };

  recognition.onerror = (event) => {
    if (event.error !== "no-speech") {
      console.error("Recognition error:", event.error);
      stopVoiceRecording(textareaId);
    }
  };

  recognition.onend = () => {
    if (state.isRecording && state.recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.error("Could not restart:", e);
      }
    }
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Could not start:", e);
    stopVoiceRecording(textareaId);
  }
}

function stopVoiceRecording(textareaId, autoExecute = false) {
  const state = voiceState[textareaId];
  if (!state.isRecording) return;

  const idMap = {
    "text-input": {
      mic: "mic-btn-text",
      status: "status-text",
      stop: "stop-btn-text",
      viz: "visualizer-text",
    },
    "morse-input": {
      mic: "mic-btn-morse",
      status: "status-morse",
      stop: "stop-btn-morse",
      viz: "visualizer-morse",
    },
    "braille-input": {
      mic: "mic-btn-braille",
      status: "status-braille",
      stop: "stop-btn-braille",
      viz: "visualizer-braille",
    },
    "home-command-input": {
      mic: "mic-btn-home",
      status: "status-home",
      stop: "stop-btn-home",
      viz: "visualizer-home",
    },
  };

  const ids = idMap[textareaId];
  state.isRecording = false;

  if (state.recognition) {
    try {
      state.recognition.stop();
    } catch (e) {
      console.error("Error stopping:", e);
    }
    state.recognition = null;
  }

  if (state.silenceTimer) {
    clearTimeout(state.silenceTimer);
    state.silenceTimer = null;
  }

  const elements = {
    micBtn: document.getElementById(ids.mic),
    status: document.getElementById(ids.status),
    stopBtn: document.getElementById(ids.stop),
    visualizer: document.getElementById(ids.viz),
  };

  elements.micBtn.classList.remove("listening");
  elements.status.classList.remove("listening");
  elements.status.textContent = "Recording stopped. Click mic to continue.";
  elements.stopBtn.disabled = true;
  elements.visualizer.classList.remove("active");

  // Auto-execute if requested
  if (autoExecute) {
    setTimeout(() => {
      const textarea = document.getElementById(textareaId);
      if (textarea && textarea.value.trim()) {
        // Determine which execute function to call based on textarea
        if (textareaId === "text-input") {
          convertToMorse();
        } else if (textareaId === "morse-input") {
          convertFromMorse();
        } else if (textareaId === "braille-input") {
          convertToBraille();
        } else if (textareaId === "home-command-input") {
          processHomeCommand();
        }
      }
    }, 100);
  }
}

function clearText(textareaId) {
  document.getElementById(textareaId).value = "";
  const statusMap = {
    "text-input": "status-text",
    "morse-input": "status-morse",
    "braille-input": "status-braille",
    "home-command-input": "status-home",
  };
  document.getElementById(statusMap[textareaId]).textContent =
    "Text cleared. Ready to record.";
}

// Morse functions
function convertToMorse() {
  const text = document.getElementById("text-input").value.toUpperCase();
  const led = document.getElementById("led-morse").checked;
  const buzzer = document.getElementById("buzzer-morse").checked;
  const listen = document.getElementById("listen-encode").checked;

  if (!text) return showStatus("morse-status", "Please enter text!", "error");

  let morse = "";
  for (let char of text) {
    morse += (morseCode[char] || "") + " ";
  }
  morse = morse.trim();

  document.getElementById("morse-output").textContent = morse;

  if (listen && morse) {
    const speakMorse = morse
      .replace(/\./g, "dot ")
      .replace(/-/g, "dash ")
      .replace(/\//g, " space ");
    speakText(speakMorse);
  }

  sendToServer("/morse-encode", { text, morse, led, buzzer }, "morse-status");

  // Clear the input after execution
  document.getElementById("text-input").value = "";
}

function convertFromMorse() {
  const morse = document.getElementById("morse-input").value.trim();
  const led = document.getElementById("led-decode").checked;
  const buzzer = document.getElementById("buzzer-decode").checked;
  const listen = document.getElementById("listen-decode").checked;

  if (!morse)
    return showStatus("decode-status", "Please enter Morse code!", "error");

  const reverseMorse = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
  );
  const text = morse
    .split(" / ")
    .map((w) =>
      w
        .split(" ")
        .map((l) => reverseMorse[l] || "?")
        .join("")
    )
    .join(" ");

  document.getElementById("text-output").textContent = text.trim();

  if (listen && text) speakText(text);

  sendToServer(
    "/morse-decode",
    { morse, text: text.trim(), led, buzzer },
    "decode-status"
  );

  // Clear the input after execution
  document.getElementById("morse-input").value = "";
}

// Braille function
function convertToBraille() {
  const text = document.getElementById("braille-input").value.toUpperCase();
  const led = document.getElementById("led-braille").checked;

  if (!text) return showStatus("braille-status", "Please enter text!", "error");

  let brailleText = "";
  let patterns = [];

  for (let char of text) {
    brailleText += brailleUnicode[char] || "⠀";
    patterns.push({
      char: char,
      pattern: braillePatterns[char] || [0, 0, 0, 0, 0, 0],
    });
  }

  document.getElementById("braille-output").textContent = brailleText;
  createBrailleVisual(text);
  sendToServer("/braille-display", { text, patterns, led }, "braille-status");

  // Clear the input after execution
  document.getElementById("braille-input").value = "";
}

function createBrailleVisual(text) {
  const visualContainer = document.getElementById("braille-visual");
  visualContainer.innerHTML = "";

  for (let char of text.toUpperCase()) {
    const pattern = braillePatterns[char] || [0, 0, 0, 0, 0, 0];
    const charDiv = document.createElement("div");
    charDiv.className = "braille-char";
    charDiv.innerHTML = `
      <div class="braille-label">${char}</div>
      <div class="braille-dots">
        <div class="braille-column">
          <div class="braille-dot ${pattern[0] ? "active" : ""}"></div>
          <div class="braille-dot ${pattern[2] ? "active" : ""}"></div>
          <div class="braille-dot ${pattern[4] ? "active" : ""}"></div>
        </div>
        <div class="braille-column">
          <div class="braille-dot ${pattern[1] ? "active" : ""}"></div>
          <div class="braille-dot ${pattern[3] ? "active" : ""}"></div>
          <div class="braille-dot ${pattern[5] ? "active" : ""}"></div>
        </div>
      </div>
    `;
    visualContainer.appendChild(charDiv);
  }
}

// ========== HOME AUTOMATION FUNCTIONS ==========

function parseHomeCommand(command) {
  command = command.toLowerCase();

  // Keywords for parsing
  const roomKeywords = {
    bedroom: ["bedroom", "bed room", "bed"],
    garage: ["garage", "living room", "living"],
    office: ["office", "study"],
  };

  const deviceKeywords = {
    light: ["light", "lights", "lamp"],
    fan: ["fan", "fans"],
  };

  const actionKeywords = {
    on: ["on", "turn on", "switch on", "start", "enable"],
    off: ["off", "turn off", "switch off", "stop", "disable"],
  };

  const allKeywords = ["all", "everything", "every"];

  let room = null;
  let device = null;
  let action = null;
  let isAll = false;

  // Check for 'all' keyword
  for (let keyword of allKeywords) {
    if (command.includes(keyword)) {
      isAll = true;
      break;
    }
  }

  // Parse room
  for (let [roomName, keywords] of Object.entries(roomKeywords)) {
    for (let keyword of keywords) {
      if (command.includes(keyword)) {
        room = roomName;
        break;
      }
    }
    if (room) break;
  }

  // Parse device
  for (let [deviceName, keywords] of Object.entries(deviceKeywords)) {
    for (let keyword of keywords) {
      if (command.includes(keyword)) {
        device = deviceName;
        break;
      }
    }
    if (device) break;
  }

  // Parse action
  for (let [actionName, keywords] of Object.entries(actionKeywords)) {
    for (let keyword of keywords) {
      if (command.includes(keyword)) {
        action = actionName;
        break;
      }
    }
    if (action) break;
  }

  return { room, device, action, isAll };
}

function processHomeCommand() {
  const commandText = document
    .getElementById("home-command-input")
    .value.trim();

  if (!commandText) {
    return showStatus(
      "home-status",
      "Please enter or speak a command!",
      "error"
    );
  }

  const parsed = parseHomeCommand(commandText);
  console.log("Parsed command:", parsed);

  if (!parsed.action) {
    return showStatus(
      "home-status",
      "Could not understand action (on/off)",
      "error"
    );
  }

  const commands = [];

  if (parsed.isAll) {
    // Handle 'all' commands
    const rooms = ["bedroom", "garage", "office"];
    const devices = parsed.device ? [parsed.device] : ["light", "fan"];

    for (let room of rooms) {
      for (let device of devices) {
        commands.push({ room, device, action: parsed.action });
      }
    }
  } else if (parsed.room && parsed.device) {
    commands.push({
      room: parsed.room,
      device: parsed.device,
      action: parsed.action,
    });
  } else if (parsed.room) {
    // If only room specified, control both light and fan
    commands.push({
      room: parsed.room,
      device: "light",
      action: parsed.action,
    });
    commands.push({ room: parsed.room, device: "fan", action: parsed.action });
  } else if (parsed.device) {
    // If only device specified, control in all rooms
    const rooms = ["bedroom", "garage", "office"];
    for (let room of rooms) {
      commands.push({ room, device: parsed.device, action: parsed.action });
    }
  } else {
    return showStatus(
      "home-status",
      "Could not understand command. Try 'turn on bedroom light'",
      "error"
    );
  }

  executeHomeCommands(commands);

  // Clear the input after execution
  document.getElementById("home-command-input").value = "";
}

function executeHomeCommands(commands) {
  const updates = {};
  let description = "";

  for (let cmd of commands) {
    const currentState = deviceStates[cmd.room][cmd.device];
    const newState = cmd.action === "on";

    if (currentState !== newState) {
      deviceStates[cmd.room][cmd.device] = newState;
      const ledId = ledMapping[cmd.room][cmd.device];
      updates[ledId] = newState;

      const deviceName = `${cmd.room} ${cmd.device}`;
      description += `${deviceName} ${cmd.action}, `;
    }
  }

  if (Object.keys(updates).length === 0) {
    showStatus("home-status", "Devices already in requested state", "error");
    return;
  }

  description = description.slice(0, -2); // Remove trailing comma

  // Speak the action
  speakText(`Turned ${commands[0].action} ${description}`);

  // Send to ESP8266
  sendToServer(
    "/home-control",
    {
      updates,
      states: deviceStates,
      description,
    },
    "home-status"
  );

  updateDeviceUI();
}

function toggleDevice(room, device) {
  const currentState = deviceStates[room][device];
  const newState = !currentState;
  const action = newState ? "on" : "off";

  deviceStates[room][device] = newState;

  const ledId = ledMapping[room][device];
  const updates = { [ledId]: newState };

  const deviceName = `${room} ${device}`;
  speakText(`Turned ${action} ${deviceName}`);

  sendToServer(
    "/home-control",
    {
      updates,
      states: deviceStates,
      description: `${deviceName} ${action}`,
    },
    "home-status"
  );

  updateDeviceUI();
}

function quickAction(action) {
  const commands = [];

  switch (action) {
    case "all-on":
      ["bedroom", "garage", "office"].forEach((room) => {
        ["light", "fan"].forEach((device) => {
          commands.push({ room, device, action: "on" });
        });
      });
      break;
    case "all-off":
      ["bedroom", "garage", "office"].forEach((room) => {
        ["light", "fan"].forEach((device) => {
          commands.push({ room, device, action: "off" });
        });
      });
      break;
    case "lights-on":
      ["bedroom", "garage", "office"].forEach((room) => {
        commands.push({ room, device: "light", action: "on" });
      });
      break;
    case "lights-off":
      ["bedroom", "garage", "office"].forEach((room) => {
        commands.push({ room, device: "light", action: "off" });
      });
      break;
    case "fans-on":
      ["bedroom", "garage", "office"].forEach((room) => {
        commands.push({ room, device: "fan", action: "on" });
      });
      break;
    case "fans-off":
      ["bedroom", "garage", "office"].forEach((room) => {
        commands.push({ room, device: "fan", action: "off" });
      });
      break;
  }

  executeHomeCommands(commands);
}

function updateDeviceUI() {
  for (let room in deviceStates) {
    for (let device in deviceStates[room]) {
      const state = deviceStates[room][device];
      const stateEl = document.getElementById(`${room}-${device}-state`);
      const cardEl = document.getElementById(`${room}-${device}-card`);

      if (stateEl && cardEl) {
        stateEl.textContent = state ? "ON" : "OFF";
        stateEl.className = `device-state ${state ? "state-on" : "state-off"}`;
        cardEl.className = `device-card ${state ? "device-active" : ""}`;
      }
    }
  }
}

// Server communication
function sendToServer(endpoint, data, statusId) {
  showStatus(statusId, "Sending to ESP8266...", "success");
  fetch(`${FLASK_SERVER}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((r) => r.json())
    .then((res) =>
      showStatus(
        statusId,
        res.success
          ? "✓ Sent to ESP8266!"
          : "Error: " + (res.error || "Unknown"),
        res.success ? "success" : "error"
      )
    )
    .catch(() =>
      showStatus(statusId, "⚠️ Could not connect to Flask server!", "error")
    );
}

function showStatus(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = "status-message status-" + type;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 5000);
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const decodeListenBox = document.createElement("div");
  decodeListenBox.className = "checkbox-item";
  decodeListenBox.innerHTML = `<input type="checkbox" id="listen-decode" /><label for="listen-decode">🔊 Listen Output</label>`;
  document
    .querySelector("#morse-decode .checkbox-group")
    .appendChild(decodeListenBox);

  const encodeListenBox = document.createElement("div");
  encodeListenBox.className = "checkbox-item";
  encodeListenBox.innerHTML = `<input type="checkbox" id="listen-encode" /><label for="listen-encode">🔊 Listen Output</label>`;
  document
    .querySelector("#morse-encode .checkbox-group")
    .appendChild(encodeListenBox);

  updateDeviceUI();

  // Add Enter key listeners to all textareas
  document.getElementById("text-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      convertToMorse();
    }
  });

  document.getElementById("morse-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      convertFromMorse();
    }
  });

  document.getElementById("braille-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      convertToBraille();
    }
  });

  document
    .getElementById("home-command-input")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        processHomeCommand();
      }
    });
});

5;
// =======================
// GESTURE CONTROL FUNCTIONS
// =======================

let gestureCheckInterval = null;

function startGestureControl() {
  showStatus(
    "gesture-control-status",
    "Starting gesture control...",
    "success"
  );

  fetch(`${FLASK_SERVER}/gesture-start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.success) {
        showStatus(
          "gesture-control-status",
          "✓ Camera window should open on your desktop (not in browser)!",
          "success"
        );
        updateGestureUI(true);
        startGestureStatusCheck();
      } else {
        showStatus(
          "gesture-control-status",
          "Error: " + (res.error || "Unknown"),
          "error"
        );
      }
    })
    .catch((err) => {
      showStatus(
        "gesture-control-status",
        "⚠️ Could not connect to Flask server!",
        "error"
      );
      console.error(err);
    });
}

function stopGestureControl() {
  showStatus(
    "gesture-control-status",
    "Stopping gesture control...",
    "success"
  );

  fetch(`${FLASK_SERVER}/gesture-stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.success) {
        showStatus(
          "gesture-control-status",
          "✓ Gesture control stopped",
          "success"
        );
        updateGestureUI(false);
        stopGestureStatusCheck();
      } else {
        showStatus(
          "gesture-control-status",
          "Error: " + (res.error || "Unknown"),
          "error"
        );
      }
    })
    .catch((err) => {
      showStatus(
        "gesture-control-status",
        "⚠️ Could not connect to Flask server!",
        "error"
      );
      console.error(err);
    });
}

function startGestureStatusCheck() {
  // Check status every 2 seconds
  gestureCheckInterval = setInterval(() => {
    fetch(`${FLASK_SERVER}/gesture-status`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.running) {
          // Gesture control stopped externally (window closed)
          updateGestureUI(false);
          stopGestureStatusCheck();
        }
      })
      .catch((err) => console.error("Status check failed:", err));
  }, 2000);
}

function stopGestureStatusCheck() {
  if (gestureCheckInterval) {
    clearInterval(gestureCheckInterval);
    gestureCheckInterval = null;
  }
}

function updateGestureUI(isRunning) {
  const indicator = document.getElementById("gesture-indicator");
  const statusText = document.getElementById("gesture-status-text");
  const startBtn = document.getElementById("start-gesture-btn");
  const stopBtn = document.getElementById("stop-gesture-btn");

  if (isRunning) {
    indicator.textContent = "🟢";
    indicator.classList.add("running");
    statusText.textContent = "Running";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } else {
    indicator.textContent = "⚪";
    indicator.classList.remove("running");
    statusText.textContent = "Not Running";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

// Check gesture status when opening the modal
function openModal(id) {
  document.getElementById(id).style.display = "block";

  if (id === "home-automation") {
    updateDeviceUI();
  } else if (id === "gesture-control") {
    // Check current gesture status
    fetch(`${FLASK_SERVER}/gesture-status`)
      .then((r) => r.json())
      .then((res) => {
        updateGestureUI(res.running);
        if (res.running) {
          startGestureStatusCheck();
        }
      })
      .catch((err) => console.error("Could not check gesture status:", err));
  }
}

// Stop status checking when closing gesture modal
function closeModal(id) {
  const inputIds = {
    "morse-encode": "text-input",
    "morse-decode": "morse-input",
    "braille-translate": "braille-input",
    "home-automation": "home-command-input",
  };

  if (inputIds[id]) stopVoiceRecording(inputIds[id]);

  if (id === "gesture-control") {
    stopGestureStatusCheck();
  }

  document.getElementById(id).style.display = "none";
}

// Add this at the end of your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // ... existing code ...

  // Check if gesture control is running on page load
  fetch(`${FLASK_SERVER}/gesture-status`)
    .then((r) => r.json())
    .then((res) => {
      if (res.running) {
        console.log("Gesture control is already running");
      }
    })
    .catch((err) => console.log("Could not check initial gesture status"));
});
