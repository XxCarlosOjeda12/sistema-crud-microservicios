import React from 'react';

const Alert = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning'
  };

  return (
    <div className={`alert ${alertClasses[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;