from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, CategoryViewSet, FeedbackViewSet, CategoryListView, RegisterUserView

# Create the router and register your viewsets
router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'feedback', FeedbackViewSet)

# Include the router URLs in your app's URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Make sure this is included
    path('categories/', CategoryListView.as_view(), name='category-list'),  # Map the URL to the view
    path('register/', RegisterUserView.as_view(), name='register'),
]
