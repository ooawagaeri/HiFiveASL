
import cv2
import os
import math

# Cropped area
x_0 = 170
x_1 = 550
y_0 = 100
y_1 = 550

output_path = 'capture_image'
asl_letters = [
               # "A",
               # "B",
               # "C",
               # "D",
               # "E",
               # "F",
               # "G",
               # "H",
               # "I",
               # "J",
               # "K",
               # "L",
               # "M",
               # "N",
               # "O",
               # "P",
               # "Q",
               # "R",
               # "S",
               # "T",
               # "U",
               # "V",
               # "W",
               # "X",
               # "Y",
               # "Z",
               "nothing"
               ]

max_images = 100

cap = cv2.VideoCapture(1)
frameRate = cap.get(5)

for output_sub_path in asl_letters:
    count = 0
    os.makedirs(f"{output_path}/{output_sub_path}", exist_ok=True)

    while cap.isOpened():
        frameId = 1 + cap.get(1)  # current frame number
        ret, frame = cap.read()
        frame = cv2.flip(frame, 1)

        if ret and not count == max_images:
            frame_crop = frame[y_0:y_1, x_0:x_1]

            if frameId % math.floor(frameRate) == 0:
                cv2.imwrite(f"{output_path}/{output_sub_path}/{output_sub_path}{3001 + count}.jpg", frame_crop)
                cap.set(cv2.CAP_PROP_POS_FRAMES, frameId)
                count += 1

            cv2.putText(frame_crop, output_sub_path, (10, 27), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.putText(frame_crop, str(count), (10, 55), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.imshow("crop", frame_crop)
            key = cv2.waitKey(25)
            if key == ord('q'):
                break
        else:
            break

cv2.destroyAllWindows()
cap.release()
