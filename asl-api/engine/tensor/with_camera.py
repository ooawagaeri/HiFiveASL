"""
with_camera.py
Used to conduct basic testing given camera feed on trained model
"""

import joblib
import numpy as np
import cv2
from all_custom_CNN import *

label_inuse = "_8000_powerhouse"
model_inuse = "_8000_resnet_30"

# Set computation device to CPU or GPU (if available)
device = ('cuda:0' if torch.cuda.is_available() else 'cpu')
print(f"Running on computation device: {device}")


def hand_area(img):
    """
    Crops given image into 224 x 224 size where hand is located
    Parameters:
        img (cv2.Mat): Webcam image
    Returns:
        area (cv2.Mat): Cropped and resized image
    """
    area = img[100:324, 100:324]
    area = cv2.resize(area, (224, 224))
    return area


# Load label binarizer and model
lb = joblib.load(f'labels/lb_alpha{label_inuse}.pkl')
model = resnet50(len(lb.classes_), device)

model.load_state_dict(torch.load(f'models/model_alpha{model_inuse}.pth'))
model.eval()

# print(model)
print('Loading model...')

# Capture webcam
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    print('Error while trying to open camera. Please check again...')

# Webcam width and height
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))

# Read until end of video
while cap.isOpened():
    # Each frame of video
    ret, frame = cap.read()

    # Draw on camera, hand box
    cv2.rectangle(frame, (100, 100), (324, 324), (20, 34, 255), 2)
    image = hand_area(frame)

    # Transform image into Tensor
    image = np.transpose(image, (2, 0, 1)).astype(np.float32)
    image = torch.tensor(image, dtype=torch.float).cuda()
    image = image.unsqueeze(0)

    # Predict image class
    outputs = model(image)
    _, prediction = torch.max(outputs.data, 1)

    # Display prediction on cv2 output
    cv2.putText(frame, lb.classes_[prediction], (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
    cv2.imshow('image', frame)

    # `Q` to exit
    if cv2.waitKey(27) & 0xFF == ord('q'):
        break

# Closes camera, frames and video windows
cap.release()
cv2.destroyAllWindows()
