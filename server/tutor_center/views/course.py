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
        'CSC101',
        'CSC110',
        'CSC120',
        'CSC144',
        'CSC210',
        'CSC245',
        'CSC252',
        'CSC335',
        'CSC337',
        'CSC345',
        'CSC352',
        'CSC380'
    ]
    return Response(courses)