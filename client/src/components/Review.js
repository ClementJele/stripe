import React, { useState } from 'react';
import axios from 'axios';


const containerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
  background: 'linear-gradient(to right,#bfbfbf, #f7f7f7, #b4b4b4)',
  borderRadius: '10px',
  boxShadow: '-10px 20px 10px rgba(0, 0, 5, 0.6)',
};

const headingStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px',
  backgroundColor: 'transparent'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const ratingSectionStyle = {
  marginBottom: '20px',
};

const starsStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const starStyle = (filled) => ({
  fontSize: '30px',
  color: filled ? '#f1c40f' : '#ccc',
  cursor: 'pointer',
  transition: 'color 0.3s',
});

const feedbackSectionStyle = {
  marginBottom: '20px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
  resize: 'none',
};

const submitBtnStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '18px',
  transition: 'background-color 0.3s',
};

const submitBtnHoverStyle = {
  backgroundColor: '#0056b3',
};

const Review = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');


  const user = JSON.parse(sessionStorage.getItem('user')) || {};
  const userID = user._id || null; 

  console.log(userID, 'User ID');
  console.log(user, 'User Object');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  
  //   if (!userID) {
  //     alert('User not logged in!');
  //     return;
  //   }
  
  //   const reviewData = {
  //     rating,
  //     feedback,
  //     userID,
  //   };
  
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URI}/api/events/reviews`, // Update this line
  //       reviewData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'x-api-key': process.env.REACT_APP_API_KEY,
  //         },
  //       }
  //     );
  
  //     if (response.status >= 200 && response.status < 300) {
  //       console.log(response.data);
  //       alert('Review submitted successfully!');
  //       setRating(0);
  //       setFeedback('');
  //     } else {
  //       alert('Failed to submit review');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('An error occurred while submitting the review');
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!userID) {
      alert('Please log in to submit a review');
      return;
    }
  
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
  
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }
  
    const reviewData = {
      rating,
      feedback,
      userID,
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/events/reviews`,
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );
  
      alert('Thank you for your feedback!');
      setRating(0);
      setFeedback('');
      
      // Optionally refresh the page or update the reviews list
      // window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>We value your feedback!</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={ratingSectionStyle}>
          <h3>Rate your experience:</h3>
          <div style={starsStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={starStyle(star <= rating)}
                onClick={() => handleRatingChange(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>

        <div style={feedbackSectionStyle}>
          <h3>Your Suggestions</h3>
          <textarea
            placeholder="How can we improve our app?"
            value={feedback}
            onChange={handleFeedbackChange}
            style={textareaStyle}
            rows="5"
          />
        </div>

        <button
          type="submit"
          style={{ ...submitBtnStyle, ...(rating > 0 ? submitBtnHoverStyle : {}) }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Review;
