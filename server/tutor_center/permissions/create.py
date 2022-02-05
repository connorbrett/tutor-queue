from rest_framework import permissions


class Create(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Only allow create requests to this endpoint.
        return request.method == "POST"
