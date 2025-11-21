import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  className = '',
  multiline = false,
  rows = 3
}) => {
  const inputStyles = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  return (
    <div className="input-container mb-4">
      {label && (
        <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputStyles}
        />
      ) : (
        <input
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputStyles}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;

