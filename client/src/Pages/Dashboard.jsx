import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { taskAPI, projectAPI, enterpriseAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tasks: 0,
    projects: 0,
    enterprises: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [projects, enterprises] = await Promise.all([
        projectAPI.getAll(),
        enterpriseAPI.getAll(),
      ]);

      let totalTasks = 0;
      let completedTasks = 0;
      let pendingTasks = 0;

      // Compter les tâches pour chaque projet
      for (const project of projects) {
        try {
          const tasks = await projectAPI.getTasks(project.id);
          totalTasks += tasks.length;
          completedTasks += tasks.filter((t) => t.status === 'COMPLETED').length;
          pendingTasks += tasks.filter((t) => t.status === 'PENDING').length;
        } catch (error) {
          console.error(`Erreur lors du chargement des tâches du projet ${project.id}:`, error);
        }
      }

      setStats({
        tasks: totalTasks,
        projects: projects.length,
        enterprises: enterprises.length,
        completedTasks,
        pendingTasks,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenue, {user?.firstName} {user?.lastName} !
        </h1>
        <p className="text-gray-600">Voici un aperçu de vos activités</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{stats.enterprises}</div>
            <div className="text-blue-100">Entreprises</div>
            <Button
              variant="secondary"
              className="mt-3 text-xs"
              onClick={() => navigate('/enterprises')}
            >
              Voir toutes
            </Button>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{stats.projects}</div>
            <div className="text-green-100">Projets</div>
            <Button
              variant="secondary"
              className="mt-3 text-xs"
              onClick={() => navigate('/projects')}
            >
              Voir tous
            </Button>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{stats.tasks}</div>
            <div className="text-purple-100">Tâches totales</div>
            <Button
              variant="secondary"
              className="mt-3 text-xs"
              onClick={() => navigate('/tasks')}
            >
              Voir toutes
            </Button>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{stats.completedTasks}</div>
            <div className="text-yellow-100">Tâches complétées</div>
            <div className="text-xs text-yellow-200 mt-1">
              {stats.pendingTasks} en attente
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Actions rapides</h2>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/projects')}
            >
              Créer un nouveau projet
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/enterprises')}
            >
              Créer une entreprise
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Vue d'ensemble</h2>
          <p className="text-gray-600 mb-4">
            Gérez efficacement vos projets, tâches et entreprises depuis ce tableau de bord.
            Utilisez le menu latéral pour naviguer entre les différentes sections.
          </p>
          <div className="text-sm text-gray-500">
            <p>Rôle: <span className="font-medium text-gray-700">{user?.role || 'COLLABORATOR'}</span></p>
            {user?.enterprise && (
              <p className="mt-2">
                Entreprise: <span className="font-medium text-gray-700">{user.enterprise.name}</span>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

