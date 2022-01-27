from enum import Enum
from djongo import models
from tutor_center.models.base import BaseModel
from django.contrib.auth import get_user_model

Tutor = get_user_model()

class Status(Enum):
    WAITING = "WAITING"
    INPROGRESS = "INPROGRESS"
    COMPLETE = "COMPLETE"
class TutoringRequest(BaseModel):
    """
    name: req.body.name,
    email: req.body.email,
    course: req.body.course,
    description: req.body.description,
    status: WAITING,
    submitted: new Date()
    """
    Statuses = [(val.name, val.value) for val in Status]
    name = models.CharField(max_length=200)
    email = models.EmailField()
    requested_course = models.CharField(max_length=10)
    #requested_course = models.ForeignKey(Course, on_delete=models.CASCADE)
    closed_time = models.DateTimeField(default=None)
    description = models.CharField(max_length=2000)
    status = models.CharField(choices=Statuses, max_length=20, default=Status.WAITING.value, blank=True)
    tutor = models.ForeignKey(Tutor, on_delete=models.SET_NULL, null=True)

