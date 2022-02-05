from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from tutor_center.serializers.request import (
    TutoringRequestSerializer,
    TutoringRequest,
    TutoringRequestAssignSerializer,
    AnonTutoringRequestSerializer,
    TutoringRequestSerializerRead,
)
from tutor_center.models.request import Status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, SAFE_METHODS
from tutor_center.permissions.create import Create
from tutor_center.views.djongo import DjongoViewSetMixin


class TutoringRequestViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    Viewset for handling tutoring requests.
    """

    queryset = TutoringRequest.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly | Create]
    filterset_fields = ["status", "tutor"]
    ordering_fields = ["closed_time", "created_time"]

    def get_serializer_class(self):
        """
        We want to hide name and email for students that want to see where they are in the queue.
        - hide other students' name and email, here we will just return other requests.
        """
        if self.request.user.is_authenticated:
            if self.request.method in SAFE_METHODS:
                return TutoringRequestSerializerRead
            return TutoringRequestSerializer
        else:
            return AnonTutoringRequestSerializer
