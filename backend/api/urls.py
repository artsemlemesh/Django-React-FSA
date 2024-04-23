


from .views import *
from django.urls import path


urlpatterns = [
    path('notes/', NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', NoteDelete.as_view(), name='delete-note'),
    
]