from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from tutor_center.serializers.request import TutoringRequestSerializer, TutoringRequest, TutoringRequestAssignSerializer, AnonTutoringRequestSerializer
from tutor_center.models.request import Status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from tutor_center.permissions.create import Create
from tutor_center.views.djongo import DjongoViewSetMixin

class TutoringRequestViewSet(viewsets.ModelViewSet, DjongoViewSetMixin):
    """
    A viewset for viewing and editing user instances.
    """
    queryset = TutoringRequest.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly | Create]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return TutoringRequestSerializer
        else:
            return AnonTutoringRequestSerializer

    @action(detail=False)
    def queue(self, request):
        queryset = TutoringRequest.objects.all().filter(status=Status.Waiting.value).order_by('created_time')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def assign(self, request, pk=None):
        tutor_request = self.get_object()
        serializer = TutoringRequestAssignSerializer(data=request.data)
        if serializer.is_valid():
            tutor_request.tutor = str(serializer.validated_data['tutor'])
            tutor_request.status = serializer.validated_data['status']
            tutor_request.save()
            return Response({'success': True})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
