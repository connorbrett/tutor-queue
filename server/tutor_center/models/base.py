from djongo import models
from tutor_center.query_sets.djongo import DjongoQuerySetMixin

class BaseModel(models.Model):
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    _id = models.ObjectIdField()
    objects = models.Manager.from_queryset(DjongoQuerySetMixin)
    class Meta:
        ordering = ['created_time']
        abstract = True
