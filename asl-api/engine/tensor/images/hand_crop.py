import cv2

# Read the img image
img = cv2.imread('capture_image/D/D3010.jpg')

# Convert into grayscale
# gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# gray = cv2.flip(gray, 1)

# Load the cascade
hand_cascade = cv2.CascadeClassifier('cascade.xml')

# Detect hands
hands = hand_cascade.detectMultiScale(img, 1.1, 4)

# Draw rectangle around the hands and crop the hands
for (x, y, w, h) in hands:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
    hands = img[y:y + h, x:x + w]
    cv2.imshow("hand", hands)

# Display the output
cv2.imshow('img', img)
cv2.waitKey()