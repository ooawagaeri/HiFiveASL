"""
move.py
Used to move background changed dataset or any other datasets into a custom directory.
"""

import os
import cv2
import numpy as np
from tqdm import tqdm

# Read path
input_path = "../../../../../Datasets/kaggle_gestures_kapil/ASL_Dataset/Train"
# Write Path
output_path = "../../../../../Datasets/custom_gestures/train"


def square_crop(img):
    """
    Crops given to 1:1 aspect ratio.
    Parameters:
        image (cv2.mat): Target image
    Returns:
        img (numpy.ndarray): Cropped image
    """
    # Retrieve height and width of target
    height, width, _ = img.shape

    # Exit if already 1:1
    if width == height:
        return img

    # Convert to numpy array
    img = np.array(img)

    # Offset to crop off
    offset = int(abs(height - width) / 2)

    # Crop horizontal side
    if width > height:
        img = img[:, offset:(width - offset), :]
    # Crop vertical side
    else:
        img = img[offset:(height - offset), :, :]

    return img


# Retrieve directories
copy_from_rng = os.listdir(input_path)

# Iterate through input_path directories
for index, sub_path in tqdm(enumerate(copy_from_rng), total=len(copy_from_rng)):
    target = f"{input_path}/{sub_path}"

    # Create subdirectories in output path
    os.makedirs(f"{output_path}/{sub_path}", exist_ok=True)

    # Starting number
    number = len(os.listdir(f"{output_path}/{sub_path}")) + 1
    # Track number of images
    count = 0

    # Iterate through input_path sub-directories
    for file in os.listdir(target):
        # Stop when limit is reached
        if count > 500:
            break

        # Path of target file
        path = os.path.join(input_path, sub_path, file)

        # Path of destination file
        dest = os.path.join(output_path, sub_path, sub_path + str(number + count) + '.jpg')

        # Read target image
        image = cv2.imread(path)

        # Crop image into 1:1 format
        image = square_crop(image)

        # Horizontal flip specific dataset
        if "kapil" in input_path:
            image = cv2.flip(image, 1)

        # Save image
        cv2.imwrite(dest, image)

        count += 1
