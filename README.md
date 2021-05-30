# Orbital Apollo 11: HI Five
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
- [Docker] - Using containers to make building, deploying and operating simpler for publication in a single package.
- [Django REST Framework] - A REST framework for building APIs to transfer information to and fro frontend and backend
- [Python] - Backend of the application, using Torch and Keras to generate and train a predictive ASL model

## Installation

HI Five requires [Node.js] 12 LTS or greater to operate the front-end and [Anaconda 3] or [Docker] for the back-end.

###Front-End
Install the dependencies

```sh
cd hifive
npm install
```
Start application
```sh
npm start  // or yarn start or expo start
```

###Back-End (Anaconda 3)
Install the dependencies via requirements.txt 
```sh
cd asl-api
conda config --add channels pytorch
conda install --file requirements-conda.txt
pip install -r requirements.txt
```
Start server
```sh
python manage.py runserver <your ip address>:8000
```

###Back-End (Docker)
Install the dependencies via Dockerfile
```sh
cd asl-api
docker build -t django-asl:latest .
```
Start server
```sh
docker run -p 8000:8000 -e PORT=8000 django-asl:latest
```

## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:

```sh
node app
```

Second Tab:

```sh
gulp watch
```

(optional) Third:

```sh
karma test
```

#### Building for source

For production release:

```sh
gulp build --prod
```

Generating pre-built zip archives for distribution:

```sh
gulp build dist --prod
```

## Docker

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd dillinger
docker build -t <youruser>/dillinger:${package.json.version} .
```

This will create the dillinger image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}
```

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [React Native]: <https://reactnative.dev/>
   [Font Awesome]: <https://fontawesome.com/>
   [Django REST Framework]: <https://www.django-rest-framework.org/>
   [Python]: <https://www.python.org/>
   [Docker]: <https://www.docker.com/>
   [Node.js]: <http://nodejs.org>
   [Anaconda 3]: <https://www.anaconda.com/>

   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
