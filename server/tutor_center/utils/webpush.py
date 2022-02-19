"""
General notification format.
{
    "notification": {
        "title": "New Notification!",
        "actions": [
            {"action": "foo", "title": "Open new tab"},
            {"action": "bar", "title": "Focus last"},
            {"action": "baz", "title": "Navigate last"},
            {"action": "qux", "title": "Just notify existing clients"}
            ],
        "data": {
            "onActionClick": {
                "default": {"operation": "openWindow"},
                "foo": {"operation": "openWindow", "url": "/absolute/path"},
                "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
                "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"}
            }
        }
    }
}
"""

from pywebpush import webpush, WebPushException
from os import environ as env
from django.forms.models import model_to_dict
import json

from tutor_center.models.webpush import Group


class Action:
    def __init__(self, name, title, operation, url):
        self.name = name
        self.title = title
        self.operation = operation
        self.url = url

    def get_action(self):
        return {"action": self.name, "title": self.title}

    def get_operation(self):
        return {"operation": self.operation, "url": self.url}


def create_notification(title, actions):
    notifications = {}
    notifications["title"] = title
    notifications["actions"] = [action.get_action() for action in actions]
    dataActions = {}
    if len(actions) == 1:
        dataActions["default"] = actions[0].get_operation()
    else:
        for action in actions:
            dataActions[action.name] = action.get_operation()

    notifications["data"] = {"onActionClick": dataActions}
    return json.dumps({"notification": notifications})


def send_notification_to_user(user, payload, ttl=0):
    # Get all the push_info of the user

    push_infos = user.webpush_info.select_related("subscription")
    for push_info in push_infos:
        _send_notification(push_info.subscription, payload, ttl)


def send_notification_to_group(group_name, payload, ttl=0):
    # Get all the subscription related to the group
    push_infos = Group.objects.get(name=group_name).webpush_info.select_related(
        "subscription"
    )
    for push_info in push_infos:
        _send_notification(push_info.subscription, payload, ttl)


def send_to_subscription(subscription, payload, ttl=0):
    return _send_notification(subscription, payload, ttl)


def _process_subscription_info(subscription):
    subscription_data = model_to_dict(subscription, exclude=["browser", "id"])
    endpoint = subscription_data.pop("endpoint")
    p256dh = subscription_data.pop("p256dh")
    auth = subscription_data.pop("auth")

    return {"endpoint": endpoint, "keys": {"p256dh": p256dh, "auth": auth}}


def _send_notification(subscription, payload, ttl):
    subscription_data = _process_subscription_info(subscription)
    vapid_data = {}

    vapid_private_key = env.get("VAPID_PRIVATE_KEY")
    vapid_admin_email = env.get("VAPID_ADMIN_EMAIL")

    # Vapid keys are optional, and mandatory only for Chrome.
    # If Vapid key is provided, include vapid key and claims
    if vapid_private_key:
        vapid_data = {
            "vapid_private_key": vapid_private_key,
            "vapid_claims": {"sub": "mailto:{}".format(vapid_admin_email)},
        }
    print(payload)
    try:
        req = webpush(
            subscription_info=subscription_data, data=payload, ttl=ttl, **vapid_data
        )
        return req
    except WebPushException as e:
        # If the subscription is expired, delete it.
        if e.response.status_code == 410:
            subscription.delete()
        else:
            # Its other type of exception!
            raise e
