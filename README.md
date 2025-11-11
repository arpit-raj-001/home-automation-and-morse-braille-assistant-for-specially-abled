# home-automation-and-morse-braille-assistant-for-specially-abled
This project creates an accessible smart home ecosystem designed specifically for individuals with disabilities. It bridges the gap between modern home automation and accessibility needs by providing multiple ways to interact with home devices like voice , text , hand gesture , braille and morse




# 🏠 Home Automation & Accessibility Assistant

An Inclusive Smart Home System for Specially-Abled Individuals

This project integrates multiple input and output modes to create an accessible home automation system for people with physical, speech, hearing, or visual impairments. Users can control home devices using text, voice, Morse code, Braille, or hand gestures, ensuring accessibility for everyone.

## 🎯 Objective

To empower specially-abled individuals with the ability to control appliances, communicate, and interact with their environment independently — regardless of physical or sensory limitations.

## 🚀 Key Features

- **🎙 Voice Control**: Turn devices on/off using natural speech.
- **✋ Hand Gesture Recognition**: Control devices through simple finger-count gestures (via camera).
- **💬 Text/Web Interface**: Accessible web dashboard for control and feedback.
- **📡 Morse Code Mode**: Convert text to Morse or input via button to send alerts or commands.
- **⠿ Braille Display**: Text converted into tactile Braille patterns using LEDs or solenoids.
- **🔔 Audio/Visual Feedback**: LED indicators and buzzer responses for status confirmation.

## 🧠 Accessibility Overview

| User Type | Input Method | Output Feedback | Problem Solved |
|-----------|--------------|-----------------|----------------|
| Mobility-Impaired | Voice commands | LED & voice feedback | Eliminates need for physical switches |
| Speech/Hearing-Impaired | Text / Morse | LED blinks + buzzer | Enables silent communication |
| Visually-Impaired | Text / Voice | Braille pattern + audio | Provides tactile text reading |
| Non-Verbal Users | Hand gestures | LED indication | Allows hands-free, non-contact control |

## ⚙️ System Architecture

User Input: Voice | Text | Gesture | Morse  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
Flask Server (Python)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
HTTP / Serial Communication  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
ESP8266 Microcontroller  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
LEDs | Buzzer | Solenoid (Braille)



## 🧩 Inputs & Outputs

### Inputs

- Voice commands
- Text from web interface
- Morse code via button
- Hand gestures via camera
- Manual toggles (optional)

### Outputs

- Text on web dashboard
- Voice feedback
- Beep tones
- LED status indicators
- Braille/solenoid tactile patterns

## 🔧 Technologies Used

| Layer | Technologies |
|-------|--------------|
| Hardware | ESP8266, LEDs, Buzzer, Solenoid |
| Software | Python, Flask, C++, HTML/CSS/JS |
| Libraries | OpenCV, MediaPipe, cvzone, Web Speech API |
| Protocols | HTTP, Serial Communication |

## 🛠️ Setup Instructions

### 1. Hardware

- Connect 6 LEDs and a buzzer to ESP8266 GPIO pins.
- (Optional) Connect solenoids for Braille tactile feedback.

### 2. ESP8266

- Upload Arduino code with your WiFi SSID and password.

### 3. Server Setup

pip install flask opencv-python cvzone
python app.py

### 4. Web Interface  
Open `index.html` in your browser on the same network.  

### 5. Try It  
- Speak: **"Turn on living room light"**  
- Or show **3 fingers** → activates corresponding device.  

---

## 💡 Innovation Highlights  

- Multi-modal accessibility in one system.  
- No cloud dependency — operates fully on local WiFi.  
- Low-cost (~$15 total hardware).  
- Works across multiple disabilities.  
- Extensible for more devices, gestures, or languages.  

---

## 🌍 Impact  

- **Independence:** Users can control their environment effortlessly.  
- **Communication:** Morse and Braille enable alternative interaction methods.  
- **Affordability:** Open-source and budget-friendly.  
- **Inclusivity:** Designed for accessibility first, not as an afterthought.  

---


---

## 🤝 Contribution  

Contributions, ideas, and improvements are welcome!  
Feel free to fork, modify, and submit pull requests.  




