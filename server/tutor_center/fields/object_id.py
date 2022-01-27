from rest_framework import serializers
from bson.objectid import ObjectId

class ObjectIdField(serializers.Field):
    """
    String objects are serialized to ObjectIds.
    """
    def to_representation(self, data):
        print(data, str(data))
        return str(data)
    
    def to_internal_value(self, data):
        print(data, ObjectId(data))
        return ObjectId(data)
