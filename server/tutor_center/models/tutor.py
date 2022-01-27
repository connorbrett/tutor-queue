from django.contrib.auth.base_user import AbstractBaseUser
from djongo import models
from tutor_center.models.course import Course
from tutor_center.managers.tutor import TutorManager

class Tutor(AbstractBaseUser):
    """
    name: req.body.name,
    email: req.body.email,
    hash: hash,
    salt: salt,
    courses: req.body.courses,
    busy: false,
    isCoord: false
    """
    _id = models.ObjectIdField()
    courses = models.CharField(max_length=2000)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    is_coord = models.BooleanField(default=False)

    objects = TutorManager()

    USERNAME_FIELD = 'email'

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return True

    @property
    def is_superuser(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_coord

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
