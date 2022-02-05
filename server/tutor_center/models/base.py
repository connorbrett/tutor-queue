from djongo import models
from tutor_center.query_sets.djongo import DjongoQuerySetMixin


class BaseModel(models.Model):
    # Default fields that are good to have.
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    _id = models.ObjectIdField()

    # Override the default behavior to use the Djonog compatible query system.
    objects = DjongoQuerySetMixin.as_manager()

    class Meta:
        ordering = ["-created_time"]
        abstract = True
