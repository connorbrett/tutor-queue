from rest_framework import serializers
from tutor_center.models import Tutor
from tutor_center.fields.object_id import ObjectIdField
from tutor_center.serializers.base import BaseSerializer

class TutorSerializer(BaseSerializer):
    # if you want to return _id, you need to have the following line.
    _id = ObjectIdField(required=False)
    class Meta:
        model = Tutor
        fields = ['_id', 'name', 'email', 'courses', 'is_coord']
