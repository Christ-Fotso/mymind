import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { taskAPI, projectAPI } from '../services/api';

const TaskView = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    projectId: selectedProjectId,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  const loadTasks = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      const data = await taskAPI.getAll(selectedProjectId);
      setTasks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!selectedProjectId) {
      alert('Veuillez sélectionner un projet');
      return;
    }
    setEditingTask(null);
    setFormData({ title: '', description: '', dueDate: '', projectId: selectedProjectId });
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      projectId: task.projectId,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingTask) {
        await taskAPI.update(editingTask.id, formData);
      } else {
        await taskAPI.create({ ...formData, projectId: selectedProjectId });
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (error) {
      alert(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await taskAPI.delete(id);
        loadTasks();
      } catch (error) {
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await taskAPI.update(id, { status });
      loadTasks();
    } catch (error) {
      alert(error.message || 'Erreur lors du changement de statut');
    }
  };

  if (loading && !selectedProjectId) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tâches</h2>
        <div className="flex gap-4 items-center">
          {projects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}
          <Button onClick={handleCreate} disabled={!selectedProjectId}>
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="text-center py-8 text-gray-500">
          Veuillez sélectionner un projet pour voir les tâches
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune tâche trouvée pour ce projet
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <Modal
        title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
      >
        <Input
          label="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          multiline
          rows={4}
        />
        <Input
          label="Date d'échéance"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default TaskView;

