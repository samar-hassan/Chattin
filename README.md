# Chattin

Chat app using Django

[![Python 3.10](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/downloads/release/python-3100/) [![django](https://img.shields.io/badge/django-4.0-green.svg)](https://docs.djangoproject.com/en/4.0/) [![Black code style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black) [![Postgres](https://img.shields.io/badge/postgres-10.x-blue.svg)](https://www.postgresql.org/download/)

# Prerequisites

- [Python 3.10.0](https://docs.python.org/3/)
- [Django 4.0](https://docs.djangoproject.com/en/4.0/)
- [Django Rest Framework 5.2](https://www.django-rest-framework.org/)
- [Postgres 10.x](https://www.postgresql.org/docs/10/index.html)

License: MIT

## Description

This chat app is developed using Django. On the frontend side, it uses jquery to manage different actions.
No frontend framework is used.

## Setup

1. Assuming you have python 3.10 installed, create a python 3.10 virtual environment

    ```bash
    virtualenv -p python venv
    source venv/bin/activate
    ```

2. Install python dependencies

    ```bash
    pip install -r requirements/local.txt
    ```

3. Install javascript dependencies

    ```bash
    npm install
    ```

4. Configure static files

    ```bash
    python manage.py collectstatic
    ```

5. Configure database

    create a file named local_settings.py in the config/settings folder and add following lines:
    ```python
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': 'chattin',
                'USER': 'postgres',
                'PASSWORD': 'postgres',
                'HOST': 'localhost',
                'PORT': '5432',
            }
        }
    ```

    update the credentials based on your settings, then run:

    ```bash
    python manage.py migrate
    ```

6. Run Project

    ```bash
    npm run dev
    ```
