from datetime import date
from dateutil import relativedelta
from dateutil.rrule import rrule, rruleset, WEEKLY


def get_end_of_semester():
    pass


def create_schedule():
    # create schedule from users
    rule_set = rruleset()

    # pull a list of holidays from https://catalog.arizona.edu/2021-2022-academic-calendar and exclude from schedule.
    rule_set.exdate()

    # create each users schedule, setting until to the day after the semester ends.
    # calendar on front end will be resource as class with tutors next to it, with ability to swap views.
    rule_set.rrule(
        rrule(
            WEEKLY,
            byweekday=relativedelta.TU(3),
            dtstart=date.today(),
            count=3,
            cache=True,
        )
    )

    # serialize each schedule into the system.
    for date in rule_set:
        print(date)
