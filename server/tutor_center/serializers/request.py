from rest_framework import serializers
from tutor_center.models import TutoringRequest, Course
from tutor_center.fields import ObjectIdField
from tutor_center.models.request import Status, Tutor
from tutor_center.serializers.base import BaseSerializer
from tutor_center.serializers.course import CourseSerializer
from tutor_center.serializers.tutor import TutorSerializer
from bson.objectid import ObjectId


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

    def validate(self, data):
        if "tutor" in data and self.instance is not None:
            user = self.context["request"].user
            # skip validation for super users.
            if not user.is_superuser:
                if self.instance.tutor and self.instance.tutor._id != data["tutor"]._id:
                    raise serializers.ValidationError(
                        {"tutor": "request is already assigned."}
                    )
                current_reqs = TutoringRequest.objects.filter(
                    tutor___id=data["tutor"]._id, status=Status.INPROGRESS.value
                )
                if current_reqs.count():
                    raise serializers.ValidationError(
                        {"tutor": "tutor already assigned to an item."}
                    )

        return super().validate(data)

    class Meta:
        model = TutoringRequest
        fields = [
            "_id",
            "status",
            "name",
            "email",
            "requested_course",
            "description",
            "status",
            "tutor",
        ]


class AnonTutoringRequestSerializer(BaseSerializer):
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
            "name",
            "email",
            "requested_course",
            "description",
            "status",
        ]


class AnonTutoringRequestSerializerRead(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)
    tutor = serializers.PrimaryKeyRelatedField(
        required=False,
        allow_null=True,
        pk_field=ObjectIdField(),
        queryset=Tutor.objects.all(),
    )

    requested_course = CourseSerializer(read_only=True)

    class Meta:
        model = TutoringRequest
        fields = [
            "_id",
            "status",
            "description",
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
