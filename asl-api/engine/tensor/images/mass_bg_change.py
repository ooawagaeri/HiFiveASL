import os
import PIL
import numpy
import numpy as np
import cv2
import random
from PIL import Image
from tqdm import tqdm
from engine.tensor.images.bg_change import BgChanger

input_path = '../../../../../Datasets/kaggle_gestures_kapil/ASL_Dataset/Train'
bg_path = 'all_bgs'
output_path = 'rng_background'


def random_crop(image, crop_height, crop_width):
    max_x = image.shape[1] - crop_width
    max_y = image.shape[0] - crop_height

    # In case image is smaller than crop dimension
    if max_x < crop_width:
        max_x = image.shape[1]
    if max_y < crop_width:
        max_y = image.shape[0]

    x = np.random.randint(0, max_x)
    y = np.random.randint(0, max_y)

    crop = image[y: y + crop_height, x: x + crop_width]

    return crop


kelvin_table = {
    1000: (255, 56, 0),
    1500: (255, 109, 0),
    2000: (255, 137, 18),
    2500: (255, 161, 72),
    3000: (255, 180, 107),
    3500: (255, 196, 137),
    4000: (255, 209, 163),
    4500: (255, 219, 186),
    5000: (255, 228, 206),
    5500: (255, 236, 224),
    6000: (255, 243, 239),
    6500: (255, 249, 253),
    7000: (245, 243, 255),
    7500: (235, 238, 255),
    8000: (227, 233, 255),
    8500: (220, 229, 255),
    9000: (214, 225, 255),
    9500: (208, 222, 255),
    10000: (204, 219, 255)}


def convert_temp(image, chosen_temp):
    temp_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    temp_image = Image.fromarray(temp_image)

    r, g, b = kelvin_table[chosen_temp]
    matrix = (r / 255.0, 0.0, 0.0, 0.0,
              0.0, g / 255.0, 0.0, 0.0,
              0.0, 0.0, b / 255.0, 0.0)
    return temp_image.convert('RGB', matrix)


changer = BgChanger()
max_images = 500

change_from = os.listdir(input_path)
for index, sub_path in tqdm(enumerate(change_from), total=len(change_from)):
    # for sub_path in os.listdir(input_path):
    os.makedirs(f"{output_path}/{sub_path}", exist_ok=True)

    start_number = 5000
    count = 0

    for file in os.listdir(f"{input_path}/{sub_path}"):

        if count == max_images:
            break

        path = os.path.join(input_path, sub_path, file)

        img = cv2.imread(path)
        img = cv2.flip(img, 1)

        bg_img = PIL.Image.open(f"{bg_path}/{random.choice(os.listdir(bg_path))}")
        frame = numpy.asarray(bg_img)
        random_bg_crop = random_crop(frame, 400, 400)

        temp = convert_temp(img, 7500)

        new_img = changer.run(numpy.array(temp), random_bg_crop)

        cv2.imwrite(f"{output_path}/{sub_path}/{sub_path}{start_number}.jpg", new_img)

        start_number += 1
        count += 1
