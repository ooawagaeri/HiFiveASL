"""
preprocess.py
Used to prepare / process dataset of images before training
"""

import os
import random
import cv2
from tqdm import tqdm

num_images = 3000
training_path = '../kaggle_gestures_akash/asl_alphabet_train/asl_alphabet_train'
output_path = 'output/preprocessed_image'

print(f"Pre-processing images from {training_path}")
print(f"Analysing {num_images} images from each category")

# Get all subdirectories within training directory
training_sub_paths = os.listdir(training_path)
# Ensures order of dataset is in ascending order
training_sub_paths.sort()

# Iterate through all files
for index, sub_path in tqdm(enumerate(training_sub_paths), total=len(training_sub_paths)):
    # Get all images within subdirectories
    all_images = os.listdir(f"{training_path}/{sub_path}")
    # Create subdirectories in output path
    os.makedirs(f"{output_path}/{sub_path}", exist_ok=True)

    # Limit on number of images to preprocess (for each category)
    for i in range(num_images):
        # Randomize selection of images for pre-processed dataset (applicable for limit set)
        rand_id = (random.randint(0, 2999))
        image = cv2.imread(f"{training_path}/{sub_path}/{all_images[rand_id]}")
        # Standardized image size & faster training on smaller images
        image = cv2.resize(image, (224, 224))
        # Storing pre-processed images
        cv2.imwrite(f"{output_path}/{sub_path}/{sub_path}{i}.jpg", image)

print('Done')
