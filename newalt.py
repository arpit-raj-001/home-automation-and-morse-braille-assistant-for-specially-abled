import cv2
import controller as cnt
from cvzone.HandTrackingModule import HandDetector
import sys
import time

print("="*60)
print("Hand Gesture Control Starting...")
print("="*60)

# Initialize hand detector
try:
    detector = HandDetector(detectionCon=0.8, maxHands=1)
    print("✓ Hand detector initialized")
except Exception as e:
    print(f"✗ Error initializing hand detector: {e}")
    print("Make sure cvzone is installed: pip install cvzone")
    input("Press Enter to exit...")
    sys.exit(1)

# Initialize video capture
try:
    video = cv2.VideoCapture(0)
    if not video.isOpened():
        raise Exception("Could not open camera")
    print("✓ Camera opened successfully")
except Exception as e:
    print(f"✗ Error opening camera: {e}")
    print("\nTroubleshooting:")
    print("1. Check if camera is connected")
    print("2. Close other applications using the camera")
    print("3. Try a different camera index (change 0 to 1 or 2)")
    input("Press Enter to exit...")
    sys.exit(1)

# Set ESP to gesture mode
print("Setting ESP8266 to gesture mode...")
if not cnt.set_gesture_mode(True):
    print("✗ Could not connect to ESP8266")
    print("The program will continue but LEDs won't respond")
    print("Check ESP8266 connection and try again")
    time.sleep(2)
else:
    print("✓ ESP8266 in gesture mode")

print("\n" + "="*60)
print("GESTURE CONTROL ACTIVE")
print("="*60)
print("Controls:")
print("  • Show 0-5 fingers to control LEDs")
print("  • Press 'k' to quit")
print("  • Close window to return to home automation")
print("="*60 + "\n")

frame_count = 0
fps_start_time = time.time()

try:
    while True:
        ret, frame = video.read()
        
        if not ret:
            print("Warning: Could not read frame from camera")
            break
            
        frame = cv2.flip(frame, 1)
        hands, img = detector.findHands(frame)
        
        # Calculate and display FPS
        frame_count += 1
        if frame_count % 30 == 0:
            fps = 30 / (time.time() - fps_start_time)
            fps_start_time = time.time()
        
        if hands:
            lmList = hands[0]
            fingerUp = detector.fingersUp(lmList)

            # Send to ESP8266
            cnt.led(fingerUp)
            
            # Display finger count
            finger_count = sum(fingerUp)
            cv2.putText(frame, f'Fingers: {finger_count}', (20, 460), 
                       cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        else:
            cv2.putText(frame, 'No hand detected', (20, 460), 
                       cv2.FONT_HERSHEY_COMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        
        # Add instructions on frame
        cv2.putText(frame, "Press 'k' to quit", (20, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        cv2.imshow("Hand Gesture Control", frame)
        
        k = cv2.waitKey(1)
        
        # Check if window was closed
        try:
            if cv2.getWindowProperty("Hand Gesture Control", cv2.WND_PROP_VISIBLE) < 1:
                break
        except:
            break
        
        # Or if 'k' key is pressed
        if k == ord("k") or k == 27:  # 'k' or ESC
            break

except KeyboardInterrupt:
    print("\n\nInterrupted by user (Ctrl+C)")
except Exception as e:
    print(f"\n\nError during execution: {e}")
    import traceback
    traceback.print_exc()
finally:
    # Cleanup
    print("\n" + "="*60)
    print("Exiting gesture control...")
    print("="*60)
    
    cnt.cleanup()
    
    if video is not None:
        video.release()
    
    cv2.destroyAllWindows()
    
    print("✓ Cleanup complete")
    print("✓ Returned to home automation mode")
    print("="*60)
