import React from 'react';
import Card from './Card';
import Button from './Button';

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    ARCHIVED: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card hover={!!onView} className="mb-4" onClick={onView ? () => onView(project.id) : undefined}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 text-sm mb-2">{project.description}</p>
          )}
          <div className="flex gap-4 items-center mt-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
              {project.status}
            </span>
            {project.tasks && (
              <span className="text-xs text-gray-500">
                {project.tasks.length} tâche(s)
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(project)}
              className="text-xs"
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={() => onDelete(project.id)}
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

export default ProjectCard;

