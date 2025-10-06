import React from 'react';

const Spinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: '',
    large: { width: '60px', height: '60px', borderWidth: '6px' }
  };

  const spinnerStyle = size === 'large' ? sizeClasses.large : {};

  if (fullScreen) {
    return (
      <div className="loading-container">
        <div 
          className={`spinner ${sizeClasses[size]}`}
          style={spinnerStyle}
        />
      </div>
    );
  }

  return (
    <div 
      className={`spinner ${sizeClasses[size]}`}
      style={spinnerStyle}
    />
  );
};

export default Spinner;