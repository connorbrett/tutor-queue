from typing import Mapping

from django.forms import ValidationError
from .base import BaseSerializer
from rest_framework import serializers
from tutor_center.models.webpush import SubscriptionInfo, PushInformation, Group
from tutor_center.fields.object_id import ObjectIdField


class KeysSerializer(serializers.Serializer):
    auth = serializers.CharField()
    p256dh = serializers.CharField()


class SubscriptionSerializer(BaseSerializer):
    def to_internal_value(self, data):
        keys = data.get("keys")
        data.update(keys)
        return super().to_internal_value(data)

    class Meta:
        model = SubscriptionInfo
        fields = ("endpoint", "auth", "p256dh")


class WebPushSerializer(BaseSerializer):
    group = serializers.PrimaryKeyRelatedField(
        required=False,
        pk_field=ObjectIdField(),
        queryset=Group.objects.all(),
    )
    subscription = SubscriptionSerializer(required=True)

    browser = serializers.CharField()
    user_agent = serializers.CharField()

    class Meta:
        model = PushInformation
        fields = ("subscription", "group", "browser", "user_agent")

    def create(self, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        subscription_data = validated_data.pop("subscription")
        subscription, created = SubscriptionInfo.objects.update_or_create(
            **subscription_data
        )
        push_info, created = PushInformation.objects.update_or_create(
            subscription=subscription,
            user=user,
            group=validated_data.pop("group", None),
            defaults={**validated_data},
        )
        return push_info
