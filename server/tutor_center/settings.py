"""
Django settings for tutor_center project.

Generated by 'django-admin startproject' using Django 4.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from pathlib import Path
import certifi
from datetime import timedelta
import environ, os

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False),
    EMAIL_USE_TLS=(bool, False),
    interpolate=True,
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "tutorqueue.cs.arizona.edu",
    "10.192.149.102",
]

# SECURE_SSL_REDIRECT = not env("DEBUG")  # Serve for HTTPS only.

# SESSION_COOKIE_SECURE = not env("DEBUG")

# CSRF_COOKIE_SECURE = not env("DEBUG")

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "tutor_center",
    "django_filters",
    "djoser",
    "drf_yasg",
]

if not DEBUG:  # only enable caching in PROD.
    INSTALLED_APPS.append("cacheops")

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = "tutor_center.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console", "error_file"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "DEBUG",
    },
}


WSGI_APPLICATION = "tutor_center.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": "tutorCenter",
        "ENFORCE_SCHEMA": False,
        "CLIENT": {
            "host": env("DATABASE_URL"),
            "username": env("DATABASE_USERNAME"),
            "password": env("DATABASE_PASSWORD"),
            "authMechanism": "SCRAM-SHA-1",
            "tlsCAFile": certifi.where(),
        },
        "LOGGING": {
            "version": 1,
            "loggers": {
                "djongo": {
                    "level": "INFO",
                    "propogate": False,
                }
            },
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/api/static/"

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = ()

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    "http://localhost:4200",  # DEV
    "http://localhost:8080",  # TEST
    "https://tutorqueue.cs.arizona.edu",  # PROD
)

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # Enable filtering, ie /requests/?status=WAITING. Simplifies a lot of endpoint calls.
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
    ],
    # "DEFAULT_THROTTLE_CLASSES": [
    #     "tutor_center.throttling.OpenHoursThrottle",
    #     "rest_framework.throttling.AnonRateThrottle",
    #     "rest_framework.throttling.UserRateThrottle",
    # ],
    "DEFAULT_THROTTLE_RATES": {"anon": "100/day", "user": "1000/day"},
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 100,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "USER_ID_FIELD": "_id",
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("JWT",),
}

BASE_URL = (
    "http://localhost:4200" if DEBUG else "https://tutorqueue.cs.arizona.edu"
)  # edit when out of DEV.

DJOSER = {
    "LOGIN_FIELD": "email",
    "SERIALIZERS": {
        "current_user": "tutor_center.serializers.CurrentUserSerializer",
        "user_create": "tutor_center.serializers.TutorSerializer",
        "user": "tutor_center.serializers.TutorSerializerRead",
    },
    "ACTIVATION_URL": f"{BASE_URL}/activate/{{uid}}/{{token}}",
    "PASSWORD_RESET_CONFIRM_URL": f"{BASE_URL}/reset-password/{{uid}}/{{token}}",
    "EMAIL": {
        "activation": "tutor_center.emails.ActivationEmail",
        "confirmation": "tutor_center.emails.ConfirmationEmail",
        "password_reset": "tutor_center.emails.PasswordResetEmail",
        "password_changed_confirmation": "tutor_center.emails.PasswordChangedConfirmationEmail",
    },
    "PERMISSIONS": {
        "set_password": ["rest_framework.permissions.IsAuthenticated"],
        "username_reset": ["rest_framework.permissions.IsAdminUser"],
        "username_reset_confirm": ["rest_framework.permissions.IsAdminUser"],
        "set_username": ["rest_framework.permissions.IsAdminUser"],
        "user_create": ["rest_framework.permissions.IsAdminUser"],
        "user_delete": [
            "rest_framework.permissions.IsAuthenticated",
            "rest_framework.permissions.IsAdminUser",
        ],
        "user": [
            "rest_framework.permissions.IsAuthenticated",
            "rest_framework.permissions.IsAdminUser",
        ],
        "user_list": ["rest_framework.permissions.IsAdminUser"],
        "token_create": ["rest_framework.permissions.AllowAny"],
        "token_destroy": ["rest_framework.permissions.IsAuthenticated"],
    },
}

SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "DRF Token": {"type": "apiKey", "name": "Authorization", "in": "header"}
    },
    "USE_SESSION_AUTH": False,
}

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_HOST_USER = env("EMAIL_USERNAME")
EMAIL_PORT = env("EMAIL_PORT", default=25)
EMAIL_USE_TLS = env("EMAIL_USE_TLS", default=False)
DEFAULT_FROM_EMAIL = "Do Not Reply <tutorcoords@cs.arizona.edu>"
EMAIL_HOST_PASSWORD = env("EMAIL_PASSWORD")

AUTH_USER_MODEL = "tutor_center.Tutor"

TUTOR_CENTER = {"OPEN_HOUR": 9, "CLOSE_HOUR": 17, "TIME_ZONE": "America/Phoenix"}

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

CACHEOPS_REDIS = {
    "host": "redis",  # redis-server is on same machine
    "port": 6379,  # default redis port
}

CACHEOPS = {
    # Automatically cache any User.objects.get() calls for 2 hours.
    # This also includes .first() and .last() calls,
    # as well as request.user or post.author access,
    # where Post.author is a foreign key to auth.User
    "auth.user": {"ops": "get", "timeout": 60 * 120},
    # Automatically cache all gets and queryset fetches
    # to other django.contrib.auth models for an hour
    "auth.*": {"ops": {"fetch", "get"}, "timeout": 60 * 60},
    # Cache all queries to Permission
    # 'all' is an alias for {'get', 'fetch', 'count', 'aggregate', 'exists'}
    "auth.permission": {"ops": "all", "timeout": 60 * 60},
    # Finally you can explicitely forbid even manual caching with:
    "tutor_center.*": {"ops": "all", "timeout": 60 * 60},
}
