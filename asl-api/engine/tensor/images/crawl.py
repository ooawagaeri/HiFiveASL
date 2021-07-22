"""
crawl.py
Used to crawl the Internet for images to use for background
"""

import os
import random
import string
from shutil import copyfile
from icrawler.builtin import BingImageCrawler

# Number of crawl it will perform
max_number_attempts = 1000
# Search terms
classes = ['outdoors', 'home interior', 'interior']
# Collation of all bgs
save_path = '../../../../../Datasets/images/all_bgs/all'

# Iterate all searches
for c in classes:
    output_path = f'../../../../../Datasets/images/all_bgs/{c}'

    # Initialize Bing image search crawler
    crawler = BingImageCrawler(downloader_threads=4, storage={'root_dir': output_path})

    # Crawl search term
    crawler.crawl(keyword=c, filters=None, max_num=max_number_attempts, offset=0)

    # For all downloaded images, copy to collation dir
    for files in os.listdir(output_path):
        # Randomize file names using UPPERCASE and NUMBERS of length 8
        id_rng = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        copyfile(f"{output_path}/{files}", f"{save_path}/{id_rng}.jpg")
