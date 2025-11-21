import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { projectAPI } from '../services/api';

const ProjectView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creatorId: user?.id || '',
    enterpriseId: user?.enterpriseId || '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({ 
      name: '', 
      description: '', 
      creatorId: user?.id || '', 
      enterpriseId: user?.enterpriseId || '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      creatorId: project.creatorId,
      enterpriseId: project.enterpriseId || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProject) {
        await projectAPI.update(editingProject.id, formData);
      } else {
        await projectAPI.create(formData);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (error) {
      alert(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await projectAPI.delete(id);
        loadProjects();
      } catch (error) {
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleView = (id) => {
    navigate(`/projects/${id}/tasks`);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projets</h2>
        <Button onClick={handleCreate}>Nouveau projet</Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun projet trouvé
        </div>
      ) : (
        <div>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <Modal
        title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
      >
        <Input
          label="Nom"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          multiline
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ProjectView;

