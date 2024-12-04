# recipes/serializers.py
from rest_framework import serializers
from .models import Recipe, Feedback, Category
from django.contrib.auth.models import User  # Import User model

# Serializer for Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Include category name (and other fields if needed)

# Serializer for User (author)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # You can add more fields like 'email', 'first_name', etc.

# Serializer for Recipe
# serializers.py
class RecipeSerializer(serializers.ModelSerializer):
    # Display the category name as a string in responses
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)  # Add category name

    # Use this field for creating and updating
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'ingredients', 'instructions', 'category', 'category_name', 'author']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'category' in validated_data:
            instance.category = validated_data.pop('category', None)
        
        return super().update(instance, validated_data)


    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
