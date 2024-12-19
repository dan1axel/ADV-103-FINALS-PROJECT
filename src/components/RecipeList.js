import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RecipeList.css';

import defaultBackground from './images/recipe.jpg';  // Default background image

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Guest');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch recipes and user details on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to access your recipes.');
      navigate('/');
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/recipes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else if (response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/');
        } else {
          setError('Failed to fetch recipes. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('An error occurred while fetching recipes.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/usersprofile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username || 'Guest');
        } else {
          console.log('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchRecipes();
    fetchUserDetails();
  }, [navigate]);

  // Function to handle deleting a recipe
  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:8000/api/recipes/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      } else {
        alert('Failed to delete recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('An error occurred while deleting the recipe.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="recipe-list-container">
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Login
        </button>
        <h1 className="greeting">Welcome, {username}! Your Recipes:</h1>

        <Link to="/add-recipe">
          <button className="add-recipe-button">Add Recipe</button>
        </Link>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="no-recipes">No recipes found. Start by adding your first recipe!</p>
        ) : (
          <div className="recipe-list">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-panel"
                style={{
                  backgroundImage: recipe.imageUrl
                    ? `url(${recipe.imageUrl})`
                    : `url(${defaultBackground})`, // Use default background if no image URL
                }}
              >
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-actions">
                  <Link to={`/recipes/${recipe.id}`}>
                    <button className="view-button">View</button>
                  </Link>
                  <Link to={`/update-recipe/${recipe.id}`}>
                    <button className="update-button">Update</button>
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(recipe.id)} // Call handleDelete
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
