from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, IsAdminUser, SAFE_METHODS
from tutor_center.serializers.tutor import TutorSerializer, Tutor
from tutor_center.views.djongo import DjongoViewSetMixin

class ReadOnly(BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """

    def has_permission(self, request, view):
        print(request.user)
        return bool(
            request.method in SAFE_METHODS
        )

class TutorViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = TutorSerializer
    permission_classes = [IsAdminUser | ReadOnly]
    queryset = Tutor.objects.all()

    @action(detail=False)
    def current(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN) 

