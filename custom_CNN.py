"""
custom_CNN.py
Used to perform / extract features from input via convolution operation(s)
"""

import torch.nn as nn
import torch.nn.functional as func
import joblib

# Load binarized labels
print('Loading label binarizer...')
lb = joblib.load('output/lb_alpha.pkl')


class CustomCNN(nn.Module):
    def __init__(self):
        super(CustomCNN, self).__init__()
        # Computes a 2-D convolution
        self.conv1 = nn.Conv2d(3, 16, 5)
        self.conv2 = nn.Conv2d(16, 32, 5)
        self.conv3 = nn.Conv2d(32, 64, 3)
        self.conv4 = nn.Conv2d(64, 128, 5)

        # Performs linear transformation on data
        self.fc1 = nn.Linear(128, 256)
        self.fc2 = nn.Linear(256, len(lb.classes_))

        # Applies 2D max pooling over input
        # Calculates maximum value in each patch of the feature map and down-samples input,
        # reducing dimensionality / parameters for better assumptions / predictions
        self.pool = nn.MaxPool2d(2, 2)

    # Feed-forward network. Feeds input through several layer
    def forward(self, x):
        # Applies the rectified linear unit function element-wise
        x = self.pool(func.relu(self.conv1(x)))
        x = self.pool(func.relu(self.conv2(x)))
        x = self.pool(func.relu(self.conv3(x)))
        x = self.pool(func.relu(self.conv4(x)))
        bs, _, _, _ = x.shape
        # Applies a 2D adaptive average pooling over an input signal composed of several input planes.
        x = func.adaptive_avg_pool2d(x, 1).reshape(bs, -1)
        x = func.relu(self.fc1(x))
        x = self.fc2(x)
        return x
