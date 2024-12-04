# recipes/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Recipe, Feedback, Category
from django.contrib.auth.models import User
from .serializers import RecipeSerializer, FeedbackSerializer, CategorySerializer

# views.py (or wherever your view logic is)
class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)


class RegisterUserView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'detail': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response({'detail': 'User registered successfully.'}, status=status.HTTP_201_CREATED)


class RecipeDetailView(APIView):
    def get_object(self, pk):
        try:
            return Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return None

    def put(self, request, pk):
        recipe = self.get_object(pk)
        if recipe is None:
            return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RecipeSerializer(recipe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        recipe = self.get_object(pk)
        if recipe is None:
            return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        recipe.delete()
        return Response({'message': 'Recipe deleted'}, status=status.HTTP_204_NO_CONTENT)
    

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    # Optional: If you want to keep the custom action for extra functionality
    @action(detail=False, methods=['post'])
    def create_category(self, request):
        category_name = request.data.get('name')
        if category_name:
            category = Category.objects.create(name=category_name)
            return Response({'id': category.id, 'name': category.name}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Category name is required'}, status=status.HTTP_400_BAD_REQUEST)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class CategoryListView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, even unauthenticated users

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    # Add the custom update method here
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Automatically set the author if not provided
        if 'author' not in data:
            data['author'] = request.user.id

        # Ensure category is set if needed
        if 'category' not in data:
            return Response({'category': ['This field is required.']}, status=400)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print(serializer.errors)  # Print errors for debugging
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data)