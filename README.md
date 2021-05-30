# Orbital Apollo 11: HI Five

![](https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/logo.png?raw=true)   

## _American Sign Language Application_


An Orbital NUS Project involving computer vision, machine learning and visual design to translate and teach American Sign Language to a greater audience.

## Features

- Sign-to-Text Translation: Real-time translation service using the phone's inbuilt camera feed into text form (alphabets).
- Text-to-Sign Translation: Search and construct words into its corresponding image of the ASL gesture.
- Pop-Quizzes: Randomly generates a gesture for the user to input a text answer to challenge oneself.
- Gesture Practice: Allows users to learn and practice the correct gesture to a corresponding letter.
- Video Resources: A library of content and media, curated across the web, aiming to provide users with learning resources beyond this app.

## Tech

HI Five uses an assortment of environments and open source projects to develop this application:
- [React Native] - A JavaScript framework for writing native-like mobile applications on iOS and Android platforms
- [Font Awesome] - Awesome font-based vector icons incorporated into the user interface
- [Kamatera] - A cloud-based platform for server deployments, hosting the Django server container 
- [Docker] - Using containers to make building, deploying and operating simpler for publication in a single package.
- [Django REST Framework] - A REST framework for building APIs to transfer information to and fro frontend and backend
- [Python] - Backend of the application, using Torch and Keras to generate and train a predictive ASL model

## Installation & Staging Deployment

HI Five requires [Node.js] 12 LTS or greater to operate the front-end and [Anaconda 3] or [Docker] for the back-end.

###Front-End

Install the dependencies for React Native from package.json
```sh
cd hifive
npm install
```
Start the application, opening the Expo CLI web interface  
```sh
npm start
```
After opening the Expo CLI web interface, scan the provided QR Code using the Expo Go
on both the [App Store] and [Google Play]

###Back-End (Anaconda 3)

Install the dependencies for the Python environment via requirements.txt 
```sh
cd asl-api
conda config --add channels pytorch
conda install --file requirements-conda.txt
pip install -r requirements.txt
```
Alternatively, via environment.yml by creating a new environment
```
conda env create -f environment.yml
conda activate venv
```

Start the Django REST API server using manage.py
```sh
python manage.py runserver <your ip address>:8000
```

###Back-End (Docker)
Install the dependencies via Dockerfile
```sh
cd asl-api
docker build -t django-asl:latest .
```
Start the Django REST API server using Docker
```sh
docker run -p 8000:8000 -e PORT=8000 django-asl:latest
```

After either backend deployment:

Verify the deployment by navigating to your server address in your preferred browser.
```sh
127.0.0.1:8000
```

## Public Production Deployment

For a live preview of the backend Django REST API server:

Do visit our [production server](http://45-126-126-89.cloud-xip.io/api/asl)
and any form of API test service such as [POSTMAN](https://www.postman.com/) and your own hand gesture images to get your own ASL prediction
{multipart/form-data, "image": <your file>} 

![](https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/postman_get.png?raw=true)
![](https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/postman_open.png?raw=true)
![](https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/postman_post.png?raw=true)

## License

MIT


[//]: #
   [React Native]: <https://reactnative.dev/>
   [Font Awesome]: <https://fontawesome.com/>
   [Django REST Framework]: <https://www.django-rest-framework.org/>
   [Python]: <https://www.python.org/>
   [Kamatera]: <https://www.kamatera.com/express/compute/>
   [Docker]: <https://www.docker.com/>
   [Node.js]: <http://nodejs.org>
   [Anaconda 3]: <https://www.anaconda.com/>
   [App Store]:<https://itunes.apple.com/app/apple-store/id982107779>
   [Google Play]:<https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www>