from enum import Enum
from tutor_center.models.course import Course
from djongo import models
from tutor_center.models.base import BaseModel
from django.contrib.auth import get_user_model
from tutor_center.query_sets.djongo import DjongoQuerySetMixin

Tutor = get_user_model()

class Status(Enum):
    Waiting = "WAITING"
    InProgress = "INPROGRESS"
    Complete = "COMPLETE"
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
    status = models.CharField(choices=Statuses, max_length=20, default=Status.Waiting.value, blank=True)
    tutor = models.ForeignKey(Tutor, on_delete=models.SET_NULL, null=True)

