from rest_framework import serializers
from tutor_center.models import TutoringRequest
from tutor_center.fields import ObjectIdField
from tutor_center.models.request import Tutor
from tutor_center.serializers.base import BaseSerializer
from tutor_center.serializers.tutor import TutorSerializer

class TutoringRequestSerializer(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)
    tutor=serializers.PrimaryKeyRelatedField(required=False, allow_null=True, pk_field=ObjectIdField(), queryset=Tutor.objects.all())
    class Meta:
        model = TutoringRequest
        fields = ['_id','status', 'description', 'name', 'email', 'requested_course', 'description', 'status', 'tutor']

class AnonTutoringRequestSerializer(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)
    tutor=serializers.PrimaryKeyRelatedField(required=False, allow_null=True, pk_field=ObjectIdField(), queryset=Tutor.objects.all())
    class Meta:
        model = TutoringRequest
        fields = ['_id','status', 'description', 'requested_course', 'description', 'status', 'tutor']

class TutoringRequestAssignSerializer(BaseSerializer):
    tutor = ObjectIdField()
    class Meta:
        model = TutoringRequest
        fields = ['status', 'tutor']
