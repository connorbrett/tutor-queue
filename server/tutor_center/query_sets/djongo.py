from xmlrpc.client import Boolean
from bson.objectid import ObjectId
from django.db import models

PK_KEYS = ["_id", "pk", "tutor", "courses"]


class DjongoQuerySetMixin(models.query.QuerySet):
    """
    This needs to exist because the conversion to objectid doesn't happen at the djongo level.
    """

    def get(self, **kwargs):
        for key in PK_KEYS:
            if key in kwargs and not isinstance(kwargs[key], ObjectId):
                kwargs[key] = ObjectId(kwargs[key])

        # related to https://github.com/nesdis/djongo/issues/465.
        # BooleanFields do not play well with Djongo.
        for key in kwargs:
            if type(kwargs[key]) == Boolean:
                kwargs[key + "__in"] = [kwargs[key]]
                del kwargs[key]
        return super().get(**kwargs)

    def filter(self, **kwargs):
        for key in PK_KEYS:
            if key in kwargs and not isinstance(kwargs[key], ObjectId):
                kwargs[key] = ObjectId(kwargs[key])
        return super().filter(**kwargs)
