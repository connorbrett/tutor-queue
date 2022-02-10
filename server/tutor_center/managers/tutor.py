from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.db import models
from tutor_center.query_sets.djongo import DjongoQuerySetMixin


class TutorManager(BaseUserManager, models.Manager.from_queryset(DjongoQuerySetMixin)):
    def create_user(
        self, email, name, courses, is_coord=False, is_active=False, password=None
    ):
        """
        Creates and saves a User with the given information and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_active=is_active,
            is_coord=is_coord,
        )

        user.set_password(password)
        user.save(using=self._db)
        user.courses.set(courses)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        """
        Creates and saves a superuser with the given information and password.
        """
        user = self.create_user(
            email,
            password=password,
            is_coord=True,
            is_active=True,
            **kwargs,
        )
        user.save(using=self._db)
        return user
