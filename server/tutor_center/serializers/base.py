from rest_framework import serializers
from bson.objectid import ObjectId

class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        fields = self.Meta.fields
        try:
            output = {}
            print(fields, [field for field in dir(instance) if field in fields])
            for attribute_name in dir(instance):
                if attribute_name in fields:
                    attribute = getattr(instance, attribute_name)
                    print(attribute_name, attribute, type(attribute))
                    if isinstance(attribute, (str, int, bool, float, type(None))):
                        # Primitive types can be passed through unmodified.
                        output[attribute_name] = attribute
                    elif isinstance(attribute, list):
                        # Recursively deal with items in lists.
                        output[attribute_name] = [
                            self.to_representation(item) for item in attribute
                        ]
                    elif isinstance(attribute, dict):
                        # Recursively deal with items in dictionaries.
                        output[attribute_name] = {
                            str(key): self.to_representation(value)
                            for key, value in attribute.items()
                        }
                    elif isinstance(attribute, ObjectId):
                        # Force anything else to its string representation.
                        output[attribute_name] = str(attribute)
                    else:
                        output[attribute_name] = super().to_representation(attribute)
            return output
        except Exception as err:
            print(err)

