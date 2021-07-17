from icrawler.builtin import BingImageCrawler

max_number = 4
classes=[ 'outdoors', 'home interior', 'interior' ]

for c in classes:
    crawler = BingImageCrawler(downloader_threads=4, storage={'root_dir': f'all_bgs/{c}'})
    crawler.crawl(keyword=c,filters=None,max_num=max_number,offset=0)