from bson.objectid import ObjectId
from django.db import models

PK_KEYS = ["_id", "pk", "tutor", "courses"]


class DjongoQuerySetMixin(models.query.QuerySet):
    """
    This needs to exist because the conversion to objectid doesn't happen at the djongo level.
    """

    def get(self, **kwargs):
        print(self)
        print(kwargs)
        for key in PK_KEYS:
            if key in kwargs and not isinstance(kwargs[key], ObjectId):
                kwargs[key] = ObjectId(kwargs[key])
        print(kwargs)
        return super().get(**kwargs)

    def filter(self, **kwargs):
        print(kwargs)
        for key in PK_KEYS:
            if key in kwargs and not isinstance(kwargs[key], ObjectId):
                kwargs[key] = ObjectId(kwargs[key])
        print(kwargs)
        return super().filter(**kwargs)
