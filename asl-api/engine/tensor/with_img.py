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
img = 'D:/5-NUS/Orbital/kaggle_gestures_akash/asl_alphabet_test/' \
      'asl_alphabet_test/A_test.jpg'

aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True),
])

# load label binarizer and model
lb = joblib.load('output/lb_alpha.pkl')
model = custom_CNN.CustomCNN("output/lb_alpha.pkl").cuda()
model.load_state_dict(torch.load('output/model_alpha.pth'))
print('Model loaded')

# Target image directory location
image = cv2.imread(img)

# Load and prepare image
image = aug(image=np.array(image))['image']
image = np.transpose(image, (2, 0, 1)).astype(np.float32)
image = torch.tensor(image, dtype=torch.float).cuda()
image = image.unsqueeze(0)

# Predict image class
start = time.time()
outputs = model(image)
_, prediction = torch.max(outputs.data, 1)
print('Predicted Object: ', prediction)
print(f"Predicted Output: {lb.classes_[prediction]}")
end = time.time()
print(f"{(end - start):.3f} seconds")
