"""
train.py
Used to train on dataset images and generate model
"""


import random
import time
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader
from tqdm import tqdm
import custom_CNN as cnn_models
from asl_image_dataset import ASLImageDataset


input_csv = 'output/data_alpha.csv'
input_pkl = 'output/lb_alpha.pkl'
output_model = 'output/model_alpha.pth'
output_accuracy = 'output/accuracy_alpha.png'
output_loss = 'output/loss_alpha.png'
# Number of training cycles / pass
epochs = 10
# Random generator seed
random_seed = 42


# Set random_seed for reproducible results
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.benchmark = True


set_seed(seed=random_seed)

# Set computation device to CPU or GPU (if available)
device = ('cuda:0' if torch.cuda.is_available() else 'cpu')
print(f"Running on computation device: {device}")

# Read CSV file of dataset
df = pd.read_csv(input_csv)
# Get image paths and labels
X = df.sub_path.values
y = df.target.values
# Split dataset into random train and test subsets
(xtrain, xtest, ytrain, ytest) = (train_test_split(X, y, test_size=0.15, random_state=42))

print(f"Training on {len(xtrain)} images")
print(f"Validating on {len(xtest)} images")

# Augment dataset images
train_data = ASLImageDataset(xtrain, ytrain)
test_data = ASLImageDataset(xtest, ytest)

# Fetch data from subsets and serve them in batches
train_loader = DataLoader(train_data, batch_size=32, shuffle=True)
test_loader = DataLoader(test_data, batch_size=32, shuffle=False)

# Initialize CNN w/ computation device
model = cnn_models.CustomCNN(input_pkl).to(device)
# print(f"\nCNN model: {model}")

# Get total number of parameters from model
total_params = sum(p.numel() for p in model.parameters())
print(f"Number of parameters: {total_params:,}")

# Get total number of trainable parameters from model
total_trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Number of trainable parameters: {total_trainable_params:,}")

# Adam optimization algorithm (stochastic gradient descent) to
# update network weights in training data
optimizer = optim.Adam(model.parameters(), lr=0.001)
# Cross Entropy Loss function to solve classification problem
criterion = nn.CrossEntropyLoss()


# Train function for training and making prediction
def train(current_model, data_loader):
    print('Training')
    # Initialize training
    current_model.train()
    # Keep track of sum of loss and accuracy
    running_loss = 0.0
    running_correct = 0
    # Iterate through data from data loader in batches
    for _, data in tqdm(enumerate(data_loader), total=int(len(train_data) / data_loader.batch_size)):
        # Assign data and value to computation device
        data, target = data[0].to(device), data[1].to(device)
        # Set gradient to zero before starting new back pass
        optimizer.zero_grad()
        outputs = current_model(data)
        # Computes loss
        loss = criterion(outputs, target)
        running_loss += loss.item()
        # Get "best" / largest value
        _, prediction = torch.max(outputs.data, 1)
        running_correct += (prediction == target).sum().item()
        # Compute gradient of loss w.r.t
        loss.backward()
        # Update parameters using gradient
        optimizer.step()

    # Training loss, error of training set
    train_loss = running_loss / len(data_loader.dataset)
    # Training accuracy, measurement of the training performance
    train_accuracy = 100. * running_correct / len(data_loader.dataset)

    print(f"Train Loss: {train_loss:.4f}, Train Accuracy: {train_accuracy:.2f}")

    return train_loss, train_accuracy


# Validation function
def validate(current_model, data_loader):
    print('Validating')
    current_model.eval()
    # Keep track of sum of loss and accuracy
    running_loss = 0.0
    running_correct = 0
    # Disables gradient calculation, used for inference / validation
    with torch.no_grad():
        # Iterate through data from data loader in batches
        for _, data in tqdm(enumerate(data_loader), total=int(len(test_data) / data_loader.batch_size)):
            # Assign data and value to computation device
            data, target = data[0].to(device), data[1].to(device)
            outputs = current_model(data)
            # Computes loss
            loss = criterion(outputs, target)
            running_loss += loss.item()
            # Get "best" / largest value
            _, prediction = torch.max(outputs.data, 1)
            running_correct += (prediction == target).sum().item()

        # Validation loss, error after running the validation set on trained network
        validate_loss = running_loss / len(data_loader.dataset)
        # Validation accuracy, measurement of the Validation performance
        validate_accuracy = 100. * running_correct / len(data_loader.dataset)
        print(f'Validate Loss: {validate_loss:.4f}, Validate Accuracy: {validate_accuracy:.2f}')

        return validate_loss, validate_accuracy


training_loss, training_accuracy = [], []
validation_loss, validation_accuracy = [], []

start = time.time()
# Iterate {number of epochs} times
for epoch in range(epochs):
    print(f"Epoch {epoch + 1} of {epochs}")
    train_epoch_loss, train_epoch_accuracy = train(model, train_loader)
    val_epoch_loss, val_epoch_accuracy = validate(model, test_loader)
    # Append training and validation points for graph
    training_loss.append(train_epoch_loss)
    training_accuracy.append(train_epoch_accuracy)
    validation_loss.append(val_epoch_loss)
    validation_accuracy.append(val_epoch_accuracy)
end = time.time()

# Accuracy graph
plt.figure(figsize=(10, 7))
plt.plot(training_accuracy, color='green', label='train accuracy')
plt.plot(validation_accuracy, color='blue', label='validation accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.savefig(output_accuracy)
plt.show()

# Loss graph
plt.figure(figsize=(10, 7))
plt.plot(training_loss, color='orange', label='train loss')
plt.plot(validation_loss, color='red', label='validation loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.savefig(output_loss)
plt.show()

# Save model as PyTorch model
print('Saving trained model...')
torch.save(model.state_dict(), output_model)
