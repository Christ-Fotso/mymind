import React from 'react';
import Card from './Card';
import Button from './Button';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <Card hover className="mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
          )}
          <div className="flex gap-4 items-center mt-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
              {task.status}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                Échéance: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {onStatusChange && task.status !== 'COMPLETED' && (
            <Button
              variant="success"
              onClick={() => onStatusChange(task.id, 'COMPLETED')}
              className="text-xs"
            >
              Terminer
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(task)}
              className="text-xs"
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={() => onDelete(task.id)}
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

export default TaskCard;

