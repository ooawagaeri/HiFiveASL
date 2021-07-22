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

# Individual image name
img = "../../../../Datasets/kaggle_gestures_dan/B/B0030_test.jpg"
model_inuse = "_4000"

# Transformer to standardize image size
aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True)
])

# Load label binarizer and model
lb = joblib.load(f'labels/lb_alpha{model_inuse}.pkl')
model = custom_CNN.CustomCNN(f"labels/lb_alpha{model_inuse}.pkl").cuda()
model.load_state_dict(torch.load(f'models/model_alpha{model_inuse}.pth'))
print('Model loaded')

# Target image directory location
image = cv2.imread(img)

# Horizontal flip
image = cv2.flip(image, 1)

# Transform image into Tensor
image = aug(image=np.array(image))['image']
image = np.transpose(image, (2, 0, 1)).astype(np.float32)
image = torch.tensor(image, dtype=torch.float).cuda()
image = image.unsqueeze(0)

# Time speed of prediction
start = time.time()

# Predict image class
outputs = model(image)

# Retrieve highest / maximum record
value, prediction = torch.max(outputs.data, 1)

# Retrieve top 3 records
top3_value, top3_prediction = torch.topk(outputs.data, 3)

print('Top 3 Predictions: ', top3_prediction)
print('Top 3 Confidence: ', top3_value)
print(f"Predicted Output: {lb.classes_[prediction]}")

# Time speed of prediction end
end = time.time()
print(f"{(end - start):.3f} seconds")


