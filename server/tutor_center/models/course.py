from tutor_center.query_sets.djongo import DjongoQuerySetMixin
from .base import BaseModel
from djongo import models


class Course(BaseModel):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
