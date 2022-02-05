from rest_framework import serializers, fields
from tutor_center.models import Tutor, Course
from tutor_center.fields.object_id import ObjectIdField
from tutor_center.serializers.base import BaseSerializer
from tutor_center.serializers.course import CourseSerializer


class TutorSerializerRead(BaseSerializer):
    # if you want to return _id, you need to have the following line.
    _id = ObjectIdField(required=False, read_only=True)
    courses = CourseSerializer(many=True)

    class Meta:
        model = Tutor
        fields = ["_id", "name", "email", "courses", "is_coord"]


class TutorSerializer(BaseSerializer):
    # if you want to return _id, you need to have the following line.
    courses = serializers.PrimaryKeyRelatedField(
        many=True,
        required=True,
        allow_null=False,
        pk_field=ObjectIdField(),
        queryset=Course.objects.all(),
    )

    class Meta:
        model = Tutor
        fields = ["name", "email", "courses", "is_coord", "password"]

    def create(self, validated_data):
        user = Tutor.objects.create(
            email=validated_data["email"],
            name=validated_data["name"],
        )

        user.courses.set(validated_data['courses'])
        user.set_password(validated_data["password"])
        user.save()

        return user

class CurrentUserSerializer(BaseSerializer):
    """
    Override of djoser serializer for /user/me
    """

    _id = ObjectIdField(required=False, read_only=True)
    courses = serializers.PrimaryKeyRelatedField(
        many=True, pk_field=ObjectIdField(), queryset=Course.objects.all()
    )

    class Meta:
        model = Tutor
        fields = ["_id", "name", "email", "courses", "is_coord"]
