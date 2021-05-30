# Docker python image
FROM continuumio/miniconda3

# Set the working directory
WORKDIR /app

# Create environment
COPY environment.yml .
RUN conda update -n base -c defaults conda
RUN conda env create -f environment.yml

# Make RUN commands use the new environment
RUN echo "conda activate venv" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# Environment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

ADD . .

# EXPOSE 8000

# Gunicorn run server
CMD gunicorn asl-api.wsgi:application --bind 0.0.0.0:$PORT
