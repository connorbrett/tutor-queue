from .base import BaseModel
from djongo import models


class Course(BaseModel):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
