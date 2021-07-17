import os
import cv2
import numpy as np
from tqdm import tqdm
import matplotlib.pyplot as plt

input_path = 'rng_background'
output_path = '../../../../../Datasets/custom_gestures/asl_alphabet_train/asl_alphabet_train'


def rotate_image(image, angle):
  image_center = tuple(np.array(image.shape[1::-1]) / 2)
  rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
  result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
  return result


copy_from = os.listdir(input_path)
for index, sub_path in tqdm(enumerate(copy_from), total=len(copy_from)):
    target  = f"{input_path}/{sub_path}"

    number = 3201
    count = 0

    for file in os.listdir(target):

        path = os.path.join(input_path, sub_path, file)
        dest = os.path.join(output_path, sub_path, sub_path + str(number + count) + '.jpg')

        image = cv2.imread(path)

        if f"{sub_path}3" in file or "D5" in file:
            image = cv2.flip(image, 1)
        elif "Z5" in file:
            image = rotate_image(image, -90)

        cv2.imwrite(dest, image)
        count = count + 1