from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import threading
import cv2
from cvzone.HandTrackingModule import HandDetector
import serial
import time

app = Flask(__name__)
CORS(app)  

ESP8266_IP = "192.168.153.133"  # ESP8266's IP
ESP8266_PORT = 80

# Serial connection for gesture control
comport = 'COM4'  # Change if needed
baudrate = 115200
board = None
gesture_thread = None
gesture_running = False

# ===========================
# Serial Communication Functions
# ===========================

def connect_serial():
    """Connect to ESP8266 via serial"""
    global board
    
    try:
        if board is not None:
            try:
                board.close()
            except:
                pass
        
        board = serial.Serial(comport, baudrate, timeout=1)
        time.sleep(2)
        print(f"✓ Connected to ESP8266 on {comport}")
        return True
    except Exception as e:
        print(f"✗ Could not connect to {comport}: {e}")
        board = None
        return False

def set_gesture_mode_serial(enable):
    """Switch ESP8266 mode via serial"""
    global board
    
    if board is None:
        if not connect_serial():
            return False
    
    try:
        command = "MODE:GESTURE\n" if enable else "MODE:HOME\n"
        board.write(command.encode())
        time.sleep(0.5)
        print(f"✓ ESP8266 mode: {'GESTURE' if enable else 'HOME'}")
        return True
    except Exception as e:
        print(f"Error setting mode: {e}")
        board = None
        return False

def send_led_pattern(fingerUp):
    """Send finger pattern to ESP8266"""
    global board
    
    if board is None:
        return False
    
    states = {
        (0,0,0,0,0): [0,0,0,0,0],
        (0,1,0,0,0): [1,0,0,0,0],
        (0,1,1,0,0): [1,1,0,0,0],
        (0,1,1,1,0): [1,1,1,0,0],
        (0,1,1,1,1): [1,1,1,1,0],
        (1,1,1,1,1): [1,1,1,1,1],
    }
    
    pattern = states.get(tuple(fingerUp), [0,0,0,0,0])
    command = ','.join(map(str, pattern)) + '\n'
    
    try:
        board.write(command.encode())
        return True
    except Exception as e:
        print(f"Error sending pattern: {e}")
        return False

# ===========================
# Gesture Control Thread
# ===========================

def gesture_control_loop():
    """Main gesture control loop running in background thread"""
    global gesture_running, board
    
    print("\n" + "="*60)
    print("Starting Gesture Control Loop...")
    print("="*60)
    
    # Initialize hand detector
    try:
        detector = HandDetector(detectionCon=0.8, maxHands=1)
        print("✓ Hand detector initialized")
    except Exception as e:
        print(f"✗ Error initializing hand detector: {e}")
        gesture_running = False
        return
    
    # Initialize camera
    try:
        video = cv2.VideoCapture(0)
        if not video.isOpened():
            raise Exception("Could not open camera")
        print("✓ Camera opened")
    except Exception as e:
        print(f"✗ Error opening camera: {e}")
        gesture_running = False
        return
    
    # Set ESP to gesture mode (try serial first, fall back to HTTP)
    if not set_gesture_mode_serial(True):
        print("⚠ Warning: Serial not available, using HTTP mode")
        try:
            esp_data = {'enable': True}
            requests.post(
                f"http://{ESP8266_IP}:{ESP8266_PORT}/gesture-mode",
                json=esp_data,
                timeout=5
            )
            print("✓ ESP set to gesture mode via HTTP")
            use_http = True
        except:
            print("⚠ Could not set ESP mode via HTTP either")
            use_http = False
    else:
        use_http = False
    
    print("\n" + "="*60)
    print("GESTURE CONTROL ACTIVE")
    print("Close the camera window or stop from web interface")
    print("="*60 + "\n")
    
    frame_count = 0
    
    try:
        while gesture_running:
            ret, frame = video.read()
            
            if not ret:
                print("Warning: Could not read frame")
                break
            
            frame = cv2.flip(frame, 1)
            hands, img = detector.findHands(frame)
            
            if hands:
                lmList = hands[0]
                fingerUp = detector.fingersUp(lmList)
                
                # Send to ESP8266 (try serial, fall back to HTTP)
                if not send_led_pattern(fingerUp) and use_http:
                    # Send via HTTP if serial fails
                    try:
                        states = {
                            (0,0,0,0,0): [0,0,0,0,0],
                            (0,1,0,0,0): [1,0,0,0,0],
                            (0,1,1,0,0): [1,1,0,0,0],
                            (0,1,1,1,0): [1,1,1,0,0],
                            (0,1,1,1,1): [1,1,1,1,0],
                            (1,1,1,1,1): [1,1,1,1,1],
                        }
                        pattern = states.get(tuple(fingerUp), [0,0,0,0,0])
                        
                        esp_data = {
                            'mode': 'gesture_pattern',
                            'pattern': pattern
                        }
                        requests.post(
                            f"http://{ESP8266_IP}:{ESP8266_PORT}/control",
                            json=esp_data,
                            timeout=0.1
                        )
                    except:
                        pass
                
                # Display finger count
                finger_count = sum(fingerUp)
                cv2.putText(frame, f'Fingers: {finger_count}', (20, 460), 
                           cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            else:
                cv2.putText(frame, 'No hand detected', (20, 460), 
                           cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            
            # Instructions
            cv2.putText(frame, "Close window to stop", (20, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow("Hand Gesture Control", frame)
            
            key = cv2.waitKey(1)
            
            # Check if window was closed
            try:
                if cv2.getWindowProperty("Hand Gesture Control", cv2.WND_PROP_VISIBLE) < 1:
                    print("Camera window closed by user")
                    break
            except:
                break
            
            # Check for ESC or 'q' key
            if key == 27 or key == ord('q'):
                print("Stopped by keypress")
                break
            
            frame_count += 1
    
    except Exception as e:
        print(f"Error in gesture loop: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        print("\n" + "="*60)
        print("Stopping Gesture Control...")
        print("="*60)
        
        gesture_running = False
        
        # Cleanup
        try:
            video.release()
            cv2.destroyAllWindows()
            print("✓ Camera released")
        except:
            pass
        
        # Return ESP to home mode
        set_gesture_mode_serial(False)
        
        print("✓ Gesture control stopped")
        print("="*60 + "\n")

# ===========================
# Flask Routes
# ===========================

@app.route('/')
def index():
    return '''
    <h1>ESP8266 Control Server</h1>
    <p>Server is running. Access the web interface from the HTML file.</p>
    <p>ESP8266 IP: {}</p>
    '''.format(ESP8266_IP)

@app.route('/gesture-start', methods=['POST'])
def gesture_start():
    """Start hand gesture control in background thread"""
    global gesture_running, gesture_thread
    
    try:
        if gesture_running:
            return jsonify({
                'success': False,
                'error': 'Gesture control already running'
            }), 400
        
        # Set ESP to gesture mode via HTTP
        try:
            esp_data = {'enable': True}
            response = requests.post(
                f"http://{ESP8266_IP}:{ESP8266_PORT}/gesture-mode",
                json=esp_data,
                timeout=5
            )
            
            if response.status_code != 200:
                return jsonify({
                    'success': False,
                    'error': 'Failed to set ESP to gesture mode via HTTP'
                }), 500
        except requests.exceptions.RequestException as e:
            print(f"Warning: Could not set ESP mode via HTTP: {e}")
            # Continue anyway, will try serial
        
        # Start gesture control in background thread
        gesture_running = True
        gesture_thread = threading.Thread(target=gesture_control_loop, daemon=True)
        gesture_thread.start()
        
        # Give it a moment to start
        time.sleep(1)
        
        if not gesture_running:
            return jsonify({
                'success': False,
                'error': 'Gesture control failed to start - check console'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Gesture control started - Camera window should appear'
        })
            
    except Exception as e:
        import traceback
        print("Error starting gesture control:")
        print(traceback.format_exc())
        gesture_running = False
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/gesture-stop', methods=['POST'])
def gesture_stop():
    """Stop hand gesture control"""
    global gesture_running, gesture_thread, board
    
    try:
        if not gesture_running:
            return jsonify({
                'success': False,
                'error': 'Gesture control not running'
            }), 400
        
        print("Stopping gesture control from web request...")
        gesture_running = False
        
        # Wait for thread to finish (max 5 seconds)
        if gesture_thread is not None:
            gesture_thread.join(timeout=5)
        
        # Close serial connection
        if board is not None:
            try:
                board.close()
                board = None
            except:
                pass
        
        # Set ESP back to home automation mode via HTTP
        try:
            esp_data = {'enable': False}
            requests.post(
                f"http://{ESP8266_IP}:{ESP8266_PORT}/gesture-mode",
                json=esp_data,
                timeout=5
            )
        except:
            pass
        
        return jsonify({
            'success': True,
            'message': 'Gesture control stopped'
        })
        
    except Exception as e:
        gesture_running = False
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/gesture-status', methods=['GET'])
def gesture_status():
    """Check if gesture control is running"""
    return jsonify({
        'running': gesture_running
    })

@app.route('/morse-encode', methods=['POST'])
def morse_encode():
    """Handle text to Morse code conversion and send to ESP8266"""
    try:
        data = request.json
        text = data.get('text', '')
        morse = data.get('morse', '')
        led = data.get('led', True)
        buzzer = data.get('buzzer', True)
        
        esp_data = {
            'mode': 'morse_encode',
            'text': text,
            'morse': morse,
            'led': led,
            'buzzer': buzzer
        }
        
        response = send_to_esp8266(esp_data)
        
        return jsonify({
            'success': True,
            'message': 'Morse code sent to ESP8266',
            'morse': morse,
            'esp_response': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/morse-decode', methods=['POST'])
def morse_decode():
    """Handle Morse code to text conversion and send to ESP8266"""
    try:
        data = request.json
        morse = data.get('morse', '')
        text = data.get('text', '')
        led = data.get('led', False)
        buzzer = data.get('buzzer', False)
        
        esp_data = {
            'mode': 'morse_decode',
            'morse': morse,
            'text': text,
            'led': led,
            'buzzer': buzzer
        }
        
        response = send_to_esp8266(esp_data)
        
        return jsonify({
            'success': True,
            'message': 'Decoded text sent to ESP8266',
            'text': text,
            'esp_response': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/braille-display', methods=['POST'])
def braille_display():
    """Handle text to Braille conversion and send to ESP8266"""
    try:
        data = request.json
        text = data.get('text', '')
        patterns = data.get('patterns', [])
        led = data.get('led', True)
        
        esp_data = {
            'mode': 'braille_display',
            'text': text,
            'patterns': patterns,
            'led': led
        }
        
        response = send_to_esp8266(esp_data)
        
        return jsonify({
            'success': True,
            'message': 'Braille pattern sent to ESP8266',
            'text': text,
            'esp_response': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/home-control', methods=['POST'])
def home_control():
    """Handle home automation control and send to ESP8266"""
    try:
        data = request.json
        updates = data.get('updates', {})
        states = data.get('states', {})
        description = data.get('description', '')
        
        esp_data = {
            'mode': 'home_control',
            'updates': updates,
            'states': states,
            'description': description
        }
        
        response = send_to_esp8266(esp_data)
        
        return jsonify({
            'success': True,
            'message': f'Home control executed: {description}',
            'esp_response': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def send_to_esp8266(data):
    """Send data to ESP8266 via HTTP POST"""
    try:
        url = f"http://{ESP8266_IP}:{ESP8266_PORT}/control"
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=data, headers=headers, timeout=5)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f'ESP8266 returned status code {response.status_code}'}
    except requests.exceptions.Timeout:
        return {'error': 'ESP8266 connection timeout'}
    except requests.exceptions.ConnectionError:
        return {'error': 'Could not connect to ESP8266. Check IP address and network.'}
    except Exception as e:
        return {'error': str(e)}

@app.route('/check-esp', methods=['GET'])
def check_esp():
    """Check if ESP8266 is reachable"""
    try:
        url = f"http://{ESP8266_IP}:{ESP8266_PORT}/status"
        response = requests.get(url, timeout=2)
        
        return jsonify({
            'success': True,
            'message': 'ESP8266 is reachable',
            'status': response.status_code
        })
    except:
        return jsonify({
            'success': False,
            'message': 'ESP8266 is not reachable'
        }), 503

# ===========================
# Cleanup on Exit
# ===========================

def cleanup():
    """Cleanup resources on server shutdown"""
    global gesture_running, board
    
    print("\nShutting down...")
    gesture_running = False
    
    if board is not None:
        try:
            set_gesture_mode_serial(False)
            board.close()
        except:
            pass
    
    cv2.destroyAllWindows()
    print("✓ Cleanup complete")

import atexit
atexit.register(cleanup)

# ===========================
# Main
# ===========================

if __name__ == '__main__':
    print("="*60)
    print("ESP8266 Unified Control Server Starting...")
    print(f"ESP8266 IP Address: {ESP8266_IP}")
    print(f"Serial Port: {comport}")
    print("Server running on: http://localhost:5000")
    print("\nAvailable Endpoints:")
    print("  - /morse-encode      : Text to Morse conversion")
    print("  - /morse-decode      : Morse to Text conversion")
    print("  - /braille-display   : Text to Braille display")
    print("  - /home-control      : Home automation control")
    print("  - /gesture-start     : Start hand gesture control")
    print("  - /gesture-stop      : Stop hand gesture control")
    print("  - /gesture-status    : Check gesture control status")
    print("="*60)
    
    # Try to connect to serial on startup
    connect_serial()
    
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
