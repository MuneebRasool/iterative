FROM python:3.9.18 as base

WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
ENV FLASK_ENV="docker"
COPY . /usr/src/app/