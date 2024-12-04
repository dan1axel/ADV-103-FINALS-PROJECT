from django.contrib import admin
from .models import Recipe, Feedback, Category
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Register the Recipe, Feedback, and Category models
admin.site.register(Recipe)
admin.site.register(Feedback)
admin.site.register(Category)
admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name')  # Customize the displayed fields