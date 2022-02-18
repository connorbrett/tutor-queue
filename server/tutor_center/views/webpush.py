from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from tutor_center.models import PushInformation

from tutor_center.serializers.webpush import WebPushSerializer


class WebPushViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = PushInformation.objects.all()
    serializer_class = WebPushSerializer
