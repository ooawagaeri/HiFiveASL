"""
create_csv.py
Used to map preprocessed dataset of images to alphabet type as CSV and pkl format
"""

import pandas as pd
import numpy as np
import os
import joblib
from sklearn.preprocessing import LabelBinarizer
from tqdm import tqdm
from imutils import paths

model_name = '_8000_powerhouse'
input_path = '../../../../Datasets/images/preprocessed_image_8000'
output_csv = f"labels/data_alpha{model_name}.csv"
output_pkl = f"labels/lb_alpha{model_name}.pkl"

# Get all subdirectories within pre-processed directory
preprocessed_paths = list(paths.list_images(input_path))

# DataFrame: Two-dimensional structure to map image to target_image (value)
data = pd.DataFrame()
labels = []

# Iterate through all files
for index, sub_path in tqdm(enumerate(preprocessed_paths),
                            total=len(preprocessed_paths)):
    # Get alphabet label
    label = sub_path.split(os.path.sep)[-2]

    # Store relative path for mapping image to label
    data.loc[index, 'sub_path'] = sub_path
    labels.append(label)

labels = np.array(labels)

# Assigns categorical (alphabet) value to data
# i.e Given a certain set of data, return a predicted label
lb = LabelBinarizer()

# Scale training data and parameters
labels = lb.fit_transform(labels)

print(f"First label: {labels[0]}")
print(f"Mapping first label to respective category: {lb.classes_[0]}")
print(f"Total number of labels (instances): {len(labels)}")

# Iterate through all labels
for i in range(len(labels)):
    # Get index of largest value
    index = np.argmax(labels[i])

    # Store label index to index
    data.loc[i, 'target_image'] = int(index)

# Shuffles dataset
data = data.sample(frac=1).reset_index(drop=True)

# Save dataset as CSV file
print('Saving dataset...')
data.to_csv(output_csv, index=False)

# Save binarized labels as pickle file
print('Saving label binarizer...')
joblib.dump(lb, output_pkl)
