"""
hand_crop.py
Used to move background changed dataset or any other datasets into a custom directory.
"""

import cv2

# Read path
input_path = '../../../../../Datasets/images/capture_image/D/D3010.jpg'

# Read image
img = cv2.imread(input_path)

# Load cascade
hand_cascade = cv2.CascadeClassifier('cascade.xml')

# Detect hands
hands = hand_cascade.detectMultiScale(img, 1.1, 4)

# Draw rectangle around each hand, and display the hand
for (x, y, w, h) in hands:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
    hands = img[y:y + h, x:x + w]
    cv2.imshow("hand", hands)

# Display input image with rectangles
cv2.imshow('img', img)
cv2.waitKey()