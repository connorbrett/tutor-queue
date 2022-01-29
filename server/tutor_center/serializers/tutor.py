from rest_framework import serializers, fields
from tutor_center.models import Tutor
from tutor_center.fields.object_id import ObjectIdField
from tutor_center.serializers.base import BaseSerializer

class TutorSerializer(BaseSerializer):
    # if you want to return _id, you need to have the following line.
    _id = ObjectIdField(required=False, read_only=True)
    class Meta:
        model = Tutor
        fields = ['_id', 'name', 'email', 'courses', 'is_coord', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Tutor.objects.create(
            courses=validated_data['courses'],
            email=validated_data['email'],
            name=validated_data['name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
