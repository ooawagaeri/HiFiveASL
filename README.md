# Orbital Apollo 11: HI Five

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/hifive/assets/icon.png?raw=true" width="250" height="250">

## _American Sign Language Application_


An Orbital NUS Project involving computer vision, machine learning and visual design to translate and teach American Sign Language to a greater audience.

## Features

- Sign-to-Text Translation: Real-time translation service using the phone's inbuilt camera feed into text form (alphabets).
- Text-to-Sign Translation: Search and construct words into its corresponding image of the ASL gesture.
- Pop-Quizzes: Randomly generates a gesture for the user to input a text answer to challenge oneself.
- Gesture Practice: Allows users to learn and practice the correct gesture to a corresponding letter.
- Video Resources: A library of content and media, curated across the web, aiming to provide users with learning resources beyond this app.

## Tech Stack

HI Five uses an assortment of environments and open source projects to develop this application:
- [Expo] - A publicly available framework and platform for React applications and publication.
- [React Native] - A JavaScript framework for writing native-like mobile applications on iOS and Android platforms
- [Kamatera] - A cloud-based platform for server deployments, hosting the Django server container
- [Docker] - Using containers to make building, deploying and operating simpler for publication in a single package.
- [Django REST Framework] - A REST framework for building APIs to transfer information to and fro frontend and backend
- [Python] - Backend of the application, using Torch and Keras to generate and train a predictive ASL model

## Installation & Staging Deployment

HI Five requires [Node.js 12 LTS or greater]  to operate the front-end and [Anaconda 3] or [Docker] for the back-end.

**Front-End**

1. Install the dependencies for React Native from package.json

```sh
cd hifive
npm install
```
2. Navigate to node_modules > react-native-thumbnail-video > src > components > thumbnail.js

3. Comment out the UNSAGE_componentWillUpdate() function

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/unsafe_componentwillupdate_change.png?raw=true">

4. Start the application, opening the Expo CLI web interface

```sh
npm start
```
5. After opening the Expo CLI web interface, scan the provided QR Code using the Expo Go on both the [App Store] and [Google Play]

<br/>

**Back-End (Anaconda 3)**

1. Install the dependencies for the Python environment via requirements.txt

```sh
cd asl-api
conda config --add channels pytorch
conda install --file requirements-conda.txt
pip install -r requirements.txt
```
2. Alternatively, via environment.yml by creating a new environment

```
conda env create -f environment.yml
conda activate venv
```

3. Start the Django REST API server using manage.py

```sh
python manage.py runserver <your ip address>:8000
```

<br/>

**Back-End (Docker)**

1. Install the dependencies via Dockerfile

```sh
cd asl-api
docker build -t django-asl:latest .
```

2. Start the Django REST API server using Docker

```sh
docker run -p 8000:8000 -e PORT=8000 django-asl:latest
```

3. After either backend deployment: Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:8000
```
or
```sh
127.0.0.1:8000
```

## Production Deployment

**Expo.io**

Expo is a publicly available framework and platform for React applications. In addition to serving as a programming
platform, Expo provides an in-house publishing service.
You can visit the publication at: https://expo.io/@ooawagaeri24/hi-five

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/expo_desktop.png?raw=true">

For Android users:

To use the published Expo application, you will need to download Expo Go from the [Google Play] and scan the QR code
(above) to run the app using Expo’s mobile client: https://expo.io/client  

For IOS users:

On top of downloading the Expo Go from the [App Store], you will need to login into our testing account
(due to Apple security regulations) before scanning the QR code (above) to run the app using Expo’s mobile client.

>Username: hifive
>
>Password: testing123

**Kamatera**

Kamatera is a service which offers flexible cloud-based solutions for developers and web app developers. Similar to
Amazon Web Services EC2, Kamatera Express provides cloud computing environments. For a live preview of the backend
Django RESTful API server at: http://45-126-126-89.cloud-xip.io/api/

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/django_api.png?raw=true">

Some subdomain URLs you can use to access the various functions are:

- Sign-To-Text: http://45-126-126-89.cloud-xip.io/api/asl
- Gesture Questions: http://45-126-126-89.cloud-xip.io/api/practiseQns/
- Gesture Reply / Answer: http://45-126-126-89.cloud-xip.io/api/practiseAns/
- Text-To-Sign: http://45-126-126-89.cloud-xip.io/api/gesture/


---

Disclaimer: Do not POST, DELETE, or PUT the given URLS. These are only for demonstration purposes, as a proof of concept
that further work can be done to add custom questions or letters beyond our intended scope.
To insert or modify at your leisure, do install the application at our github and run it in your own environment!

---

## License

MIT


[//]: #
   [Expo]: <https://expo.io/>
   [React Native]: <https://reactnative.dev/>
   [Django REST Framework]: <https://www.django-rest-framework.org/>
   [Python]: <https://www.python.org/>
   [Kamatera]: <https://www.kamatera.com/express/compute/>
   [Docker]: <https://www.docker.com/>
   [Node.js 12 LTS or greater]: <http://nodejs.org>
   [Anaconda 3]: <https://www.anaconda.com/>
   [App Store]:<https://itunes.apple.com/app/apple-store/id982107779>
   [Google Play]:<https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www>
