"""
with_img.py
Used to conduct basic testing given image file on model
"""


import time
import albumentations
import cv2
import joblib
import numpy as np
import torch
import custom_CNN
from engine.tensor.images.bg_removal import BgRemover

# Individual image name
img = "D:/5-NUS\Orbital\Datasets\kaggle_gestures_dan\B\B0030_test.jpg"
model_inuse = "_3200"

aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True)
])
bg = BgRemover()

# Load label binarizer and model
lb = joblib.load(f'output/label/lb_alpha{model_inuse}.pkl')
model = custom_CNN.CustomCNN(f"output/label/lb_alpha{model_inuse}.pkl").cuda()
model.load_state_dict(torch.load(f'output/model_alpha{model_inuse}.pth'))
print('Model loaded')

# Target image directory location
image = cv2.imread(img)
image = cv2.flip(image, 1)
# image = bg.run(image)

# Load and prepare image
image = aug(image=np.array(image))['image']
image = np.transpose(image, (2, 0, 1)).astype(np.float32)
image = torch.tensor(image, dtype=torch.float).cuda()
image = image.unsqueeze(0)

# Predict image class
start = time.time()
outputs = model(image)
value, prediction = torch.max(outputs.data, 1)
value2, prediction2 = torch.topk(outputs.data, 3)

print('Top 3 Predictions: ', prediction2)
print('Top 3 Confidence: ', value2)

print(f"Predicted Output: {lb.classes_[prediction]}")
end = time.time()
print(f"{(end - start):.3f} seconds")


