"""
capture_image.py
Used to photo-take images manually by developer.
"""

import cv2
import os
import math

# Write path
output_path = '../../../../../Datasets/images/capture_image'

# Letter that is being captured
asl_letters = 'A'

# Limit of images captured
max_images = 100


def hand_area(img):
    """
    Crops given image into 450 x 450 size where hand is located
    Parameters:
        img (cv2.Mat): Webcam image
    Returns:
        area (cv2.Mat): Cropped and resized image
    """
    area = img[100:550, 170:550]
    return area


# Capture webcam
cap = cv2.VideoCapture(1)

# Retrieve frame rate
frameRate = cap.get(5)

# Track number of images taken
count = 0

# Make directory
os.makedirs(f"{output_path}/{asl_letters}", exist_ok=True)

# Read until end of video
while cap.isOpened():
    # Current frame number
    frameId = 1 + cap.get(1)

    # Each frame of video
    ret, frame = cap.read()

    # ret, if frame is successful
    # If number of captures has hit max
    if ret and count != max_images:
        frame_crop = hand_area(frame)

        # Capture image once every frame rate
        if frameId % math.floor(frameRate) == 0:
            # Save image
            cv2.imwrite(f"{output_path}/{asl_letters}/{asl_letters}{count}.jpg", frame_crop)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frameId)
            count += 1

        # Display letter being captured
        cv2.putText(frame_crop, asl_letters, (10, 27), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(frame_crop, str(count), (10, 55), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.imshow("crop", frame_crop)

        # `Q` to exit
        if cv2.waitKey(27) & 0xFF == ord('q'):
            break

    else:
        break

# Closes camera, frames and video windows
cv2.destroyAllWindows()
cap.release()
