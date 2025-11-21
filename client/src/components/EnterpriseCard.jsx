import React from 'react';
import Card from './Card';
import Button from './Button';

const EnterpriseCard = ({ enterprise, onEdit, onDelete, onView }) => {
  return (
    <Card hover={!!onView} className="mb-4" onClick={onView ? () => onView(enterprise.id) : undefined}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{enterprise.name}</h3>
          {enterprise.address && (
            <p className="text-gray-600 text-sm mb-2">📍 {enterprise.address}</p>
          )}
          <div className="flex gap-4 items-center mt-3 text-xs text-gray-500">
            {enterprise.projects && (
              <span>{enterprise.projects.length} projet(s)</span>
            )}
            {enterprise.users && (
              <span>{enterprise.users.length} utilisateur(s)</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(enterprise)}
              className="text-xs"
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={() => onDelete(enterprise.id)}
              className="text-xs"
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EnterpriseCard;

