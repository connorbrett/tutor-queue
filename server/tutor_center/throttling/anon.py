from datetime import datetime, tzinfo
from locale import currency
from pytz import timezone, utc
from rest_framework import throttling
from django.conf import settings

def is_within_open_hours():
    """
    This assumes that the open hour and closed hour are not outside of the timezone offset of the day.
    """
    time_zone = timezone(settings.TUTOR_CENTER['TIME_ZONE'])
    curr_time = datetime.now(tz=utc).replace(minute=0, second=0, microsecond=0).astimezone(time_zone)
    open_time = curr_time.replace(hour=settings.TUTOR_CENTER['OPEN_HOUR'])
    close_time = curr_time.replace(hour=settings.TUTOR_CENTER['CLOSE_HOUR'])
    print(open_time, close_time, curr_time)
    return curr_time > open_time and curr_time < close_time

class OpenHoursThrottle(throttling.BaseThrottle):
    """
    Throttle all unauthorized requests that happen outside of open hours.
    """
    def allow_request(self, request, view):
        if request.user.is_authenticated:
            return True  # Only throttle unauthenticated requests.
        if settings.TUTOR_CENTER:
            return is_within_open_hours()
        raise NotImplementedError()
