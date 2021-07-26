"""
with_img.py
Used to conduct basic testing given image directory on model
"""

import os
import albumentations
import cv2
import joblib
import numpy as np
import torch
from PIL import Image

import custom_CNN

model_inuse = "_8000"
# Directory of test images
# Kaggle Dan is non-trained dataset
input_path = "../../../../Datasets/kaggle_gestures_dan"

# Transformer to standardize image size
# Perform augmentation / transformation on image
aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True)
])


def convert_warm_temp(img):
    """
    Changes the colour temperature of given image.
    Parameters:
        img (cv2.Mat): Target image
    Returns:
        (cv2.Mat): Cropped background image
    """
    # CV2 to PIL Image
    temp_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    temp_image = Image.fromarray(temp_image)

    # 7500 Kelvin Temperature
    r, g, b = (235, 238, 255)
    matrix = (r / 255.0, 0.0, 0.0, 0.0,
              0.0, g / 255.0, 0.0, 0.0,
              0.0, 0.0, b / 255.0, 0.0)

    # Apply new temperature and convert to numpy/cv2 matrix
    return np.array(temp_image.convert('RGB', matrix))


def inspect(image_path, expected):
    """
    Predicts letter of given image and compares against the expected outcome
    Parameters:
        image_path (str): File directory path of image
        expected (str): Expected output of image
    Returns:
        (boolean): If prediction is correct
    """
    # Load image from directory
    image = cv2.imread(image_path)
    # image = convert_warm_temp(image)

    # Transform image into Tensor
    image = aug(image=np.array(image))['image']
    image = np.transpose(image, (2, 0, 1)).astype(np.float32)
    image = torch.tensor(image, dtype=torch.float).cuda()
    image = image.unsqueeze(0)

    # Predict image class
    outputs = model(image)
    _, prediction = torch.max(outputs.data, 1)

    # Compares if prediction is equal to expectation
    return lb.classes_[prediction] == expected


# Load label binarizer and model
lb = joblib.load(f'labels/lb_alpha{model_inuse}.pkl')
model = custom_CNN.CustomCNN(f"labels/lb_alpha{model_inuse}.pkl").cuda()
model.load_state_dict(torch.load(f'models/model_alpha{model_inuse}.pth'))
print('Model loaded')

# Keep track of all correct and total attempts
total_correct = 0
total_all = 0

# Iterates through all sub-directories in directory
for sub_path in os.listdir(input_path):
    # Track correct outputs per letter
    correct_count = 0

    # Get number of files in sub-directory
    subdir = os.listdir(f"{input_path}/{sub_path}")

    # Add number of files to total
    total_all += len(subdir)

    # Iterates through all files in sub-directory
    for file in subdir:
        # Full path of file
        path = os.path.join(input_path, sub_path, file)

        # Compare file (image) prediction
        if inspect(path, sub_path):
            # Increment if correct
            correct_count += 1

    total_correct = total_correct + correct_count
    print(f"{sub_path} correctness: {correct_count}/{len(subdir)}")

# Final stats of directory correctness accuracy
print('Total correctness: {0:.2f}%'.format(total_correct / total_all * 100))
