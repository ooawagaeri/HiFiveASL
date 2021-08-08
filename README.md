<p align="center">
  <a href="https://getbootstrap.com/">
      <img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/hifive/assets/icon.png?raw=true" width="225" height="225">
  </a>
</p>
<h1 align="center">Orbital Apollo 11: HI Five</h1>
<h3 align="center"><i>An American Sign Language Application</i></h3>
<p align="center">
An Orbital NUS Project involving computer vision, machine learning and visual design to translate and teach American Sign Language to a greater audience.
<br>
<br>
<a href="https://github.com/twbs/bootstrap/issues/new?template=bug_report.md"><strong>Watch Our Overview Video</strong></a>
·
<a href="https://docs.google.com/document/d/1mcwQNOPeJEktWSWh4hMidNtkC43IOc3qrt4Oz8TZbSY/edit?usp=sharing"><strong>Explore Our In-depth Orbital Docs »</strong></a>
</p>

## Table of contents

- [Feature](#features)
- [Tech Stack](#tech-stack)
- [UML Diagram](#uml-diagram)
- [Included Folders](#included-folders)
- [Frontend Installation](#frontend-installation)
- [Backend Installation](#backend-installation)
- [Production Deployment](#production-deployment)

## Features

- Sign-to-Text Translation: Real-time translation service using the phone's inbuilt camera feed into text form (alphabets).
- Text-to-Sign Translation: Search and construct words into its corresponding image of the ASL gesture.
- Pop-Quizzes: Randomly generates a gesture for the user to input a text answer to challenge oneself.
- Gesture Practice: Allows users to learn and practice the correct gesture to a corresponding letter.
- Resources: A library of content and media, curated across the web, aiming to provide users with learning resources beyond this app.

## Tech Stack

HI Five uses an assortment of environments and open source projects to develop this application:

- [Expo] - A publicly available framework and platform for React applications and publication.
- [React Native] - A JavaScript framework for writing native-like mobile applications on iOS and Android platforms
- [Kamatera] - A cloud-based platform for server deployments, hosting the Django server container
- [Docker] - Using containers to make building, deploying and operating simpler for publication in a single package.
- [Django REST Framework] - A REST framework for building APIs to transfer information to and fro frontend and backend
- [Python] - Backend of the application, using Torch and Keras to generate and train a predictive ASL model

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/program_flow.png?raw=true">

## UML Diagram

**Class Diagram**

HI Five's backend system representation of its classes, properties, actions, and object connections.

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/model_uml.png?raw=true">


## Dataset

In total, the final model of which our ASL translation was trained on were 172,819 images. Primarily consisting of the images from Kaggle
Akash, Augusto, Bikash, Jordi, Kapil, Tristan and SigNN Team. This custom dataset is a collation of all alphabets, “nothing” (no hand
inside image) and background substituted hand images.

To download our custom dataset, click <a href="https://drive.google.com/file/d/1xULHHcMaQfecc1yivM2ZEQW0PRgjCRQU/view?usp=sharing">here</a>.


## Included Folders

Within the download you will find the following directories like this:

```text
orbital-asl-application/
├───asl-api
│   ├───asl-api
│   ├───engine
│   │   ├───migrations
│   │   ├───tensor
│   │   │   ├───diagrams
│   │   │   ├───images
│   │   │   ├───labels
│   │   │   └───models
│   ├───media
│   │   ├───get_images
│   │   └───post_images
│   ├───static
│   │   ├───admin
│   │   │   ├───css
│   │   │   │   └───vendor
│   │   │   │       └───select2
│   │   │   ├───fonts
│   │   │   ├───img
│   │   │   │   └───gis
│   │   │   └───js
│   │   │       ├───admin
│   │   │       └───vendor
│   │   │           ├───jquery
│   │   │           ├───select2
│   │   │           │   └───i18n
│   │   │           └───xregexp
│   │   └───rest_framework
│   │       ├───css
│   │       ├───docs
│   │       │   ├───css
│   │       │   ├───img
│   │       │   └───js
│   │       ├───fonts
│   │       ├───img
│   │       └───js
│   └───templates
├───hifive
│   ├───assets
│   │   └───fonts
│   ├───components
│   │   └───patches
│   ├───my-app
│   └───screens
└───README Resources

```

## Frontend Installation

HI Five requires [Node.js 12 LTS or greater] to operate the frontend interface.

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

## Backend Installation

HI Five requires [Anaconda 3] or [Docker] to operate the backend API.

<h3>Anaconda Version</h3>

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

<h3>Docker Version</h3>

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

<h3>Expo.io</h3>

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

> Username: hifive
>
> Password: testing123

<h3>Kamatera</h3>

Kamatera is a service which offers flexible cloud-based solutions for developers and web app developers. Similar to
Amazon Web Services EC2, Kamatera Express provides cloud computing environments.

If you are using a Kamatera server, do open your machine's PORT 80 or respective port as your URL endpoint would
differ from this projects.

For a live preview of the backend
Django RESTful API server at: http://45-126-126-89.cloud-xip.io/api/

<img src="https://github.com/ooawagaeri/orbital-asl-application/blob/main/README%20Resources/django_api.png?raw=true">

Some subdomain URLs you can use to access the various functions are:

- Sign-To-Text: http://45-126-126-89.cloud-xip.io/api/asl
- Gesture Questions: http://45-126-126-89.cloud-xip.io/api/practiseQns/
- Gesture Reply / Answer: http://45-126-126-89.cloud-xip.io/api/practiseAns/
- Text-To-Sign: http://45-126-126-89.cloud-xip.io/api/gesture/
- Pop-Quiz: http://45-126-126-89.cloud-xip.io/api/quizChoice/

---

Disclaimer: Do not POST, DELETE, or PUT the given URLS. These are for demonstration purposes only, as any unnecessary
modification could jeopardize the functionality of the server.

To insert or modify at your own leisure, do install the application at our Github and run it in your own environment.

---

## License

MIT

[//]: #
[expo]: https://expo.io/
[react native]: https://reactnative.dev/
[django rest framework]: https://www.django-rest-framework.org/
[python]: https://www.python.org/
[kamatera]: https://www.kamatera.com/express/compute/
[docker]: https://www.docker.com/
[node.js 12 lts or greater]: http://nodejs.org
[anaconda 3]: https://www.anaconda.com/
[app store]: https://itunes.apple.com/app/apple-store/id982107779
[google play]: https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www
