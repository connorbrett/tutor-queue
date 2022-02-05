from rest_framework.permissions import IsAuthenticatedOrReadOnly
from tutor_center.models.course import Course
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from tutor_center.views.djongo import DjongoViewSetMixin
from tutor_center.serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    Viewset for handling tutoring requests.
    """

    queryset = Course.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CourseSerializer
    filterset_fields = ["code"]
    ordering_fields = ["created_time", 'code']

