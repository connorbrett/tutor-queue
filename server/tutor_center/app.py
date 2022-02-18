from django.apps import AppConfig
from dotenv import load_dotenv

load_dotenv()


class TutorCenterConfig(AppConfig):
    name = "tutor_center"
    verbose_name = "Tutor Center Server"

    def ready(self):
        pass  # imported signals would go here.
