import time
import albumentations
import cv2
import joblib
import numpy as np
import torch
import custom_CNN

img = 'A_test.jpg'
aug = albumentations.Compose([
    albumentations.Resize(224, 224, always_apply=True),
])

# load label binarizer and model
lb = joblib.load('output/lb_alpha.pkl')
model = custom_CNN.CustomCNN().cuda()
model.load_state_dict(torch.load('output/model_alpha.pth'))
print(model)
print('Model loaded')

image = cv2.imread(f"../kaggle_gestures_akash/asl_alphabet_test/asl_alphabet_test/{img}")
image_copy = image.copy()

# Load and prepare image
image = aug(image=np.array(image))['image']
image = np.transpose(image, (2, 0, 1)).astype(np.float32)
image = torch.tensor(image, dtype=torch.float).cuda()
image = image.unsqueeze(0)
print(image.shape)

# Predict image class
start = time.time()
outputs = model(image)
_, prediction = torch.max(outputs.data, 1)
print('Prediction: ', prediction)
print(f"Predicted output: {lb.classes_[prediction]}")
end = time.time()
print(f"{(end - start):.3f} seconds")

cv2.putText(image_copy, lb.classes_[prediction], (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
cv2.imshow('image', image_copy)
cv2.imwrite(f"output/{img}", image_copy)
cv2.waitKey(0)
