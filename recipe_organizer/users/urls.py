from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, AuthorViewSet

# Create a router for the viewsets
router = DefaultRouter()
router.register(r'authors', AuthorViewSet)

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/', include(router.urls)),  # This adds /api/authors/ to your URL patterns
]
