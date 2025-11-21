import React from 'react';

const Card = ({ children, className = '', onClick, hover = false }) => {
  const baseStyles = 'bg-white rounded-lg shadow-md p-4';
  const hoverStyles = hover ? 'cursor-pointer transition-shadow hover:shadow-lg' : '';

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

