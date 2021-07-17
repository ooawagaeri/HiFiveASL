"""
with_img.py
Used to conduct basic testing given image file on model
"""

import os
import albumentations
import cv2
import joblib
import numpy as np
import torch
import custom_CNN

# Individual image name
# input_path = "D:/5-NUS\Orbital\Datasets\kaggle_gestures_dan"
input_path = "D:/5-NUS\Orbital\Datasets\kaggle_gestures_kapil\ASL_Dataset\Test"
model_inuse = "_4500"

aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True)
])


def inspect(image_path, expected):
    image = cv2.imread(image_path)
    # image = cv2.flip(image, 1)

    # Load and prepare image
    image = aug(image=np.array(image))['image']
    image = np.transpose(image, (2, 0, 1)).astype(np.float32)
    image = torch.tensor(image, dtype=torch.float).cuda()
    image = image.unsqueeze(0)

    # Predict image class
    outputs = model(image)
    _, prediction = torch.max(outputs.data, 1)

    return lb.classes_[prediction] == expected


# Load label binarizer and model
lb = joblib.load(f'labels/lb_alpha{model_inuse}.pkl')
model = custom_CNN.CustomCNN(f"labels/lb_alpha{model_inuse}.pkl").cuda()
model.load_state_dict(torch.load(f'models/model_alpha{model_inuse}.pth'))
print('Model loaded')

total_correct = 0
total_all = 0

for sub_path in os.listdir(input_path):
    correct_count = 0

    subdir = os.listdir(f"{input_path}/{sub_path}")
    total_all = total_all + len(subdir)

    for file in subdir:
        path = os.path.join(input_path, sub_path, file)
        if inspect(path, sub_path):
            correct_count = correct_count + 1

    total_correct = total_correct + correct_count
    print(f"{sub_path} correctness: {correct_count}/{len(subdir)}")

print('Total correctness: {0:.2f}%'.format(total_correct / total_all * 100))
