import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams(); // Recipe ID from the URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [recipeFeedback, setRecipeFeedback] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Fetch recipe and feedback data
  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return alert('You must be logged in to view this recipe.');
      }

      try {
        const response = await fetch(`${apiUrl}/api/recipes/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
        } else {
          alert('Failed to fetch recipe details.');
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return alert('You must be logged in to view feedback.');
      }

      try {
        // Fetch feedback only for the current recipe using the recipe ID
        const response = await fetch(`${apiUrl}/api/feedback/?recipe=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setRecipeFeedback(data); // Set feedback only for this recipe
        } else {
          alert('Failed to fetch feedback.');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    // Fetch both the recipe and its feedback
    fetchRecipe();
    fetchFeedback();
  }, [id, apiUrl]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return alert('You must be logged in to submit feedback.');
    }

    if (rating < 1 || rating > 5) {
      return setFeedbackMessage('Please provide a rating between 1 and 5.');
    }

    try {
      const response = await fetch(`${apiUrl}/api/feedback/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe: id, // Recipe ID
          comment: feedback,
          rating: rating,
        }),
      });

      if (response.ok) {
        setFeedbackMessage('Feedback submitted successfully!');
        setFeedback('');
        setRating(0);

        // After submitting, fetch the feedback again for this specific recipe
        const feedbackResponse = await fetch(`${apiUrl}/api/feedback/?recipe=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (feedbackResponse.ok) {
          const data = await feedbackResponse.json();
          setRecipeFeedback(data); // Update feedback for the current recipe
        }
      } else {
        setFeedbackMessage('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      setFeedbackMessage('An error occurred while submitting feedback.');
    }
  };

  const handleGoBack = () => {
    navigate('/recipes');
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <div className="recipe-detail-container">
      <button onClick={handleGoBack} className="back-button">Back to Recipe List</button>
      <h2 className="recipe-title">{recipe.title}</h2>
      <div className="recipe-info">
        <p><strong>Description:</strong> {recipe.description}</p>
        <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
        <p><strong>Instructions:</strong> {recipe.instructions}</p>
        <p><strong>Category:</strong> {recipe.category_name || 'N/A'}</p>
        <p><strong>Author:</strong> {recipe.author}</p>
      </div>

      <div className="feedback-section">
        <h3>Submit Feedback</h3>
        <form onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            required
            rows="4"
          />
          <div className="rating-section">
            <label htmlFor="rating">Rating:</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </div>
          <button
            type="submit"
            className="submit-feedback-button"
            disabled={rating === 0 || feedback.trim() === ''}
          >
            Submit Feedback
          </button>
        </form>
        {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
      </div>

      {/* Display Feedback for the current recipe */}
      <div className="recipe-feedback">
        <h4>Feedback</h4>
        {recipeFeedback.length > 0 ? (
          recipeFeedback.map((feedbackItem) => (
            <div key={feedbackItem.id} className="feedback-item">
              <p><strong>Rating:</strong> {feedbackItem.rating} / 5</p>
              <p className="comment">{feedbackItem.comment}</p>
            </div>
          ))
        ) : (
          <p>No feedback yet for this recipe.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
