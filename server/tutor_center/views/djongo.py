from bson.objectid import ObjectId
from rest_framework import viewsets, exceptions
from tutor_center.query_sets.djongo import PK_KEYS

class DjongoViewSetMixin(viewsets.GenericViewSet):
    def get_object(self):
        try:
            return self.queryset.get(_id=ObjectId(self.kwargs['pk']))
        except:
            raise exceptions.NotFound()
