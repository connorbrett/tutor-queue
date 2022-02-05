from tutor_center.fields.object_id import ObjectIdField
from tutor_center.models.course import Course
from tutor_center.serializers.base import BaseSerializer



class CourseSerializer(BaseSerializer):
    _id = ObjectIdField(required=False, read_only=True)

    class Meta:
        model = Course
        fields = ["code", "name", "_id"]
