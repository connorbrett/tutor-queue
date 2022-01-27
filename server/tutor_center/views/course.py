from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly

@api_view()
@permission_classes([IsAuthenticatedOrReadOnly])
def list_courses(request):
    """
    Return a static list of all courses.
    """
    courses = [
        'CSC144',
        'CSC244',
        'CSC120'
    ]
    return Response(courses)