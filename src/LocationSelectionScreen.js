import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from './LocationContext'; // Adjust path if needed
import './LocationSelectionScreen.css'; // optional CSS

const LocationSelectionScreen = () => {
  const { setLocationId } = useLocation();
  const navigate = useNavigate();

  const selectLocation = (locationId) => {
    setLocationId(locationId);
    navigate('/food-list'); // navigate to food list
  };

  return (
    <div className="location-container">
      <h1>Select Your Location</h1>
      <button onClick={() => selectLocation('FoodData')}>Vidhyarthi Khaana (Law)</button>
      <button onClick={() => selectLocation('FoodData2')}>Vidhyarthi Khaana (Sports)</button>
    </div>
  );
};

export default LocationSelectionScreen;
