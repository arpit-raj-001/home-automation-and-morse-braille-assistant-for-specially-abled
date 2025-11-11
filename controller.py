import serial
import time

# Configure your COM port and baud rate
comport = 'COM4'  # Change if needed
baudrate = 115200

# Initialize serial connection
board = None
connection_attempts = 0
max_attempts = 3

def connect():
    """Attempt to connect to ESP8266"""
    global board, connection_attempts
    
    while connection_attempts < max_attempts:
        try:
            board = serial.Serial(comport, baudrate, timeout=1)
            time.sleep(2)  # Wait for ESP8266 to initialize
            print(f"✓ Connected to ESP8266 on {comport}")
            return True
        except serial.SerialException as e:
            connection_attempts += 1
            print(f"Attempt {connection_attempts}/{max_attempts}: Could not connect to {comport}")
            if connection_attempts < max_attempts:
                print(f"Retrying in 2 seconds...")
                time.sleep(2)
            else:
                print(f"ERROR: Failed to connect after {max_attempts} attempts")
                print(f"Error: {e}")
                print("\nTroubleshooting:")
                print("1. Check if ESP8266 is connected to the correct COM port")
                print("2. Close Arduino IDE Serial Monitor if open")
                print("3. Try unplugging and replugging the ESP8266")
                return False
    return False

def set_gesture_mode(enable):
    """Switch ESP8266 between gesture mode and home automation mode"""
    global board
    
    if board is None:
        if not connect():
            return False
    
    try:
        if enable:
            command = "MODE:GESTURE\n"
            print("Switching to GESTURE mode...")
        else:
            command = "MODE:HOME\n"
            print("Switching to HOME AUTOMATION mode...")
        
        board.write(command.encode())
        time.sleep(0.5)  # Give ESP time to switch modes
        return True
    except Exception as e:
        print(f"Error setting mode: {e}")
        board = None  # Reset connection
        return False

def led(fingerUp):
    """Send finger gesture pattern to ESP8266"""
    global board
    
    if board is None:
        if not connect():
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
    
    # Send pattern as comma-separated values
    command = ','.join(map(str, pattern)) + '\n'
    
    try:
        board.write(command.encode())
        return True
    except Exception as e:
        print(f"Error sending data: {e}")
        board = None  # Reset connection
        return False

def cleanup():
    """Close serial connection"""
    global board
    
    if board is not None:
        try:
            set_gesture_mode(False)  # Return to home automation mode
            board.close()
            print("Serial connection closed")
        except Exception as e:
            print(f"Error during cleanup: {e}")
        finally:
            board = None

# Try to connect on import
connect()
