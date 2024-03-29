from rest_framework import viewsets, status
from rest_framework.decorators import action, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import BasePermission, IsAdminUser, SAFE_METHODS
from tutor_center.serializers.input import FileSerializer
from tutor_center.serializers.tutor import TutorSerializer, Tutor, TutorSerializerRead
from tutor_center.views.djongo import DjongoViewSetMixin
import csv, io


class ReadOnly(BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """

    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS)


class TutorViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    A viewset for viewing and editing user instances.
    """

    permission_classes = [IsAdminUser | ReadOnly]
    queryset = Tutor.objects.all()

    def get_serializer_class(self):
        """
        We want to hide name and email for students that want to see where they are in the queue.
        - hide other students' name and email, here we will just return other requests.
        """
        if self.request.method in SAFE_METHODS:
            return TutorSerializerRead
        return TutorSerializer

    @action(detail=False)
    def current(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["POST"])
    @parser_classes([MultiPartParser, FormParser])
    def upload(self, request):
        if "file" not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        with io.TextIOWrapper(request.data["file"], encoding="utf-8") as text_file:
            reader = csv.reader(text_file, delimiter=",", quotechar="|")
            for row in reader:
                print(row[0])
