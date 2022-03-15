from rest_framework import serializers
from tutor_center.models import TutoringRequest, Course
from tutor_center.fields import ObjectIdField
from tutor_center.models.request import Tutor
from tutor_center.serializers.base import BaseSerializer
from tutor_center.serializers.course import CourseSerializer
from tutor_center.serializers.tutor import TutorSerializer


class TutoringRequestSerializerRead(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)
    tutor = TutorSerializer(read_only=True)

    requested_course = CourseSerializer(read_only=True)

    class Meta:
        model = TutoringRequest
        fields = [
            "_id",
            "status",
            "description",
            "name",
            "email",
            "requested_course",
            "description",
            "status",
            "tutor",
            "closed_time",
            "created_time",
        ]


class TutoringRequestSerializer(BaseSerializer):
    tutor = serializers.PrimaryKeyRelatedField(
        required=False,
        allow_null=True,
        pk_field=ObjectIdField(),
        queryset=Tutor.objects.all(),
    )
    requested_course = serializers.PrimaryKeyRelatedField(
        write_only=True,
        allow_null=False,
        pk_field=ObjectIdField(),
        queryset=Course.objects.all(),
    )

    class Meta:
        model = TutoringRequest
        fields = [
            "_id",
            "status",
            "description",
            "name",
            "email",
            "requested_course",
            "description",
            "status",
            "tutor",
        ]


class AnonTutoringRequestSerializer(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)
    tutor = serializers.PrimaryKeyRelatedField(
        required=False,
        allow_null=True,
        pk_field=ObjectIdField(),
        queryset=Tutor.objects.all(),
    )
    requested_course_id = serializers.PrimaryKeyRelatedField(
        required=True,
        allow_null=False,
        pk_field=ObjectIdField(),
        queryset=Course.objects.all(),
    )

    requested_course = CourseSerializer(read_only=True)

    class Meta:
        model = TutoringRequest
        fields = [
            "_id",
            "status",
            "description",
            "requested_course_id",
            "requested_course",
            "description",
            "status",
            "tutor",
        ]


class TutoringRequestAssignSerializer(BaseSerializer):
    tutor = ObjectIdField()

    class Meta:
        model = TutoringRequest
        fields = ["_id", "status", "tutor"]
