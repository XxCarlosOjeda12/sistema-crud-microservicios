import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium' // small, medium, large
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: { maxWidth: '400px' },
    medium: { maxWidth: '500px' },
    large: { maxWidth: '700px' }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        style={sizeClasses[size]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;