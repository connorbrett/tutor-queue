from rest_framework import serializers
from bson.objectid import ObjectId


class ObjectIdField(serializers.Field):
    """
    String objects are serialized to ObjectIds.
    """

    def get_value(self, data):
        value = data[self.source]
        print(value)
        return self.to_representation(value)

    def to_representation(self, data):
        return str(data)

    def to_internal_value(self, data):
        return ObjectId(data)
