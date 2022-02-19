from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from tutor_center.models import PushInformation
import json

from tutor_center.serializers.webpush import WebPushSerializer
from tutor_center.utils.webpush import (
    Action,
    create_notification,
    send_notification_to_user,
)


class WebPushViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = PushInformation.objects.all()
    serializer_class = WebPushSerializer

    @action(detail=False)
    def send(self, request):
        try:
            data = create_notification(
                "Test Notification!!!",
                [
                    Action(
                        "tst_action",
                        "Open",
                        "openWindow",
                        "http://localhost:4200/tutor/queue",
                    )
                ],
            )
            print(data)
            send_notification_to_user(request.user, data)
            return Response(status=200)
        except:
            return Response(status=401)
