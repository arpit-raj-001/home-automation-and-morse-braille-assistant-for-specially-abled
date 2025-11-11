* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.1em;
  opacity: 0.9;
}

.main-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.feature-title {
  font-size: 1.4em;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.feature-desc {
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.modal-content {
  background: white;
  max-width: 800px;
  margin: 20px auto;
  border-radius: 15px;
  padding: 30px;
  position: relative;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2em;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: 600;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.voice-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 25px 0;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 15px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.mic-container {
  position: relative;
  width: 140px;
  height: 140px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mic-container:hover {
  transform: scale(1.05);
}

.mic-button {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(145deg, #667eea, #764ba2);
  border: none;
  cursor: pointer;
  position: relative;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3),
    inset 0 -5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mic-button:active {
  transform: scale(0.95);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.mic-icon {
  font-size: 3.5em;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.mic-button.listening {
  animation: pulse-glow 1.5s infinite;
  background: linear-gradient(145deg, #f093fb, #f5576c);
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 10px 40px rgba(240, 147, 251, 0.6),
      0 0 0 0 rgba(240, 147, 251, 0.7), inset 0 -5px 15px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 10px 50px rgba(240, 147, 251, 0.8),
      0 0 0 20px rgba(240, 147, 251, 0), inset 0 -5px 15px rgba(0, 0, 0, 0.2);
  }
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid #667eea;
  opacity: 0;
}

.mic-button.listening .pulse-ring {
  animation: pulse-ring 1.5s infinite;
}

@keyframes pulse-ring {
  0% {
    width: 140px;
    height: 140px;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.voice-controls-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.voice-btn {
  padding: 10px 25px;
  border-radius: 25px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
}

.voice-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.voice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-btn.stop {
  border-color: #f5576c;
  color: #f5576c;
}

.voice-btn.stop:hover:not(:disabled) {
  background: #f5576c;
  color: white;
}

.voice-status {
  text-align: center;
  font-size: 1.1em;
  color: #555;
  font-weight: 500;
  min-height: 30px;
}

.voice-status.listening {
  color: #f5576c;
  font-weight: 600;
  animation: fade-pulse 1.5s infinite;
}

@keyframes fade-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.audio-visualizer {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 60px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.audio-visualizer.active {
  opacity: 1;
}

.audio-bar {
  width: 6px;
  height: 20px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 3px;
  animation: wave 1s ease-in-out infinite;
}

.audio-bar:nth-child(1) {
  animation-delay: 0s;
}
.audio-bar:nth-child(2) {
  animation-delay: 0.1s;
}
.audio-bar:nth-child(3) {
  animation-delay: 0.2s;
}
.audio-bar:nth-child(4) {
  animation-delay: 0.3s;
}
.audio-bar:nth-child(5) {
  animation-delay: 0.4s;
}
.audio-bar:nth-child(6) {
  animation-delay: 0.3s;
}
.audio-bar:nth-child(7) {
  animation-delay: 0.2s;
}
.audio-bar:nth-child(8) {
  animation-delay: 0.1s;
}

@keyframes wave {
  0%,
  100% {
    height: 20px;
  }
  50% {
    height: 50px;
  }
}

.output-box {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  min-height: 60px;
  font-family: "Courier New", monospace;
  font-size: 1.1em;
  word-break: break-all;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.status-message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  display: none;
}

.status-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Braille Visual Display */
.braille-visual {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  justify-content: center;
}

.braille-char {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.braille-letter {
  font-weight: 600;
  color: #555;
  font-size: 0.9em;
}

.braille-dots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 10px;
  background: white;
  border: 2px solid #667eea;
  border-radius: 8px;
}

.braille-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: white;
  transition: all 0.3s ease;
}

.braille-dot.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

/* Add these styles to your existing zzzmpmcstyles.css file */

/* Braille Visual Display */
.braille-visual {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  justify-content: center;
}

.braille-char {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
}

.braille-label {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.braille-dots {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.braille-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.braille-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.braille-dot.active {
  background: #00ff88;
  border-color: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3),
    inset 0 0 10px rgba(255, 255, 255, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.8), 0 0 30px rgba(0, 255, 136, 0.5);
  }
}

/* Output box enhancement for Braille */
#braille-output {
  font-size: 32px;
  letter-spacing: 5px;
  line-height: 1.8;
  text-align: center;
  font-family: "Courier New", monospace;
}

/* Responsive design for Braille display */
@media (max-width: 768px) {
  .braille-visual {
    gap: 15px;
    padding: 15px;
  }

  .braille-char {
    min-width: 60px;
    padding: 10px;
  }

  .braille-label {
    font-size: 18px;
  }

  .braille-dot {
    width: 14px;
    height: 14px;
  }

  .braille-dots {
    gap: 8px;
    padding: 8px;
  }

  .braille-column {
    gap: 6px;
  }
}

/* Add these styles to your existing zzzmpmcstyles.css file */

/* Modal size adjustment for home automation */
.modal-large .modal-content {
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Command help section */
.command-help {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin: 20px 0;
  font-size: 14px;
  line-height: 1.8;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.command-help strong {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
}

/* Home Control Panel */
.home-control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
  padding: 20px 0;
}

.room-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.room-section h3 {
  color: white;
  margin: 0 0 20px 0;
  font-size: 22px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.device-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.device-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.device-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.device-card.device-active {
  background: rgba(0, 255, 136, 0.3);
  border-color: #00ff88;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.device-icon {
  font-size: 48px;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.device-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.device-state {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.device-state.state-on {
  background: #00ff88;
  color: #1a1a2e;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
  animation: pulse-state 2s ease-in-out infinite;
}

.device-state.state-off {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

@keyframes pulse-state {
  0%,
  100% {
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 255, 136, 0.8);
  }
}

.toggle-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
}

.toggle-btn:active {
  transform: scale(0.95);
}

/* Quick Actions */
.quick-actions {
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  text-align: center;
}

.quick-actions h3 {
  color: white;
  margin: 0 0 20px 0;
  font-size: 22px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.quick-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  margin: 8px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.quick-btn:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-control-panel {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .device-controls {
    grid-template-columns: 1fr;
  }

  .modal-large .modal-content {
    max-width: 95%;
    padding: 15px;
  }

  .room-section {
    padding: 20px 15px;
  }

  .quick-btn {
    display: block;
    margin: 10px 0;
    width: 100%;
  }
}

/* Braille Visual Display (from previous artifact) */
.braille-visual {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  justify-content: center;
}

.braille-char {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
}

.braille-label {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.braille-dots {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.braille-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.braille-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.braille-dot.active {
  background: #00ff88;
  border-color: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3),
    inset 0 0 10px rgba(255, 255, 255, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.8), 0 0 30px rgba(0, 255, 136, 0.5);
  }
}

#braille-output {
  font-size: 32px;
  letter-spacing: 5px;
  line-height: 1.8;
  text-align: center;
  font-family: "Courier New", monospace;
}

.gesture-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
}

.gesture-info ul {
  list-style: none;
  padding-left: 0;
  margin: 10px 0;
}

.gesture-info ul li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.gesture-info ul li:before {
  content: "👉";
  position: absolute;
  left: 0;
}

.gesture-visual {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.gesture-example {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.gesture-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.gesture-label {
  font-size: 12px;
  font-weight: bold;
}

.gesture-status-box {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.status-indicator {
  font-size: 30px;
  animation: pulse 2s infinite;
}

.status-indicator.running {
  animation: pulse-green 1s infinite;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.button-group .btn {
  flex: 1;
}

.btn-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
}

.warning-box {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

@keyframes pulse-green {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
