from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from tutor_center.serializers.tutor import TutorSerializer, Tutor
from tutor_center.views.djongo import DjongoViewSetMixin

class TutorViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = TutorSerializer
    queryset = Tutor.objects.all()

    @action(detail=False)
    def current(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN) 

