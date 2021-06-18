"""
asl_image_dataset.py
Used to augment dataset images in order to better CNN performance
"""

import albumentations
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset


class ASLImageDataset(Dataset):
    def __init__(self, path, labels):
        self.X = path
        self.y = labels
        # Augmentation pipeline; Resize
        self.aug = albumentations.Compose([
            albumentations.Resize(224, 224, always_apply=True),
        ])

    def __len__(self):
        return len(self.X)

    def __getitem__(self, i):
        image = cv2.imread(self.X[i])
        # Perform augmentation on image
        image = self.aug(image=np.array(image))['image']
        image = np.transpose(image, (2, 0, 1)).astype(np.float32)
        label = self.y[i]
        # Create tensors
        return torch.tensor(image, dtype=torch.float), torch.tensor(label, dtype=torch.long)
