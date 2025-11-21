import React from 'react';
import Button from './Button';

const Modal = ({ 
  title, 
  children, 
  isOpen, 
  onClose, 
  onConfirm,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  showFooter = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        {showFooter && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant="primary" onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

