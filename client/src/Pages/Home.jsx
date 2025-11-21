import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Projet d'exemple pour utilisateur non connecté
  const demoProject = {
    name: 'Débuter sur MyMind',
    tasks: [
      {
        id: 1,
        title: 'Créer un compte',
        description: 'Inscrivez-vous pour commencer à utiliser MyMind',
        completed: false,
      },
      {
        id: 2,
        title: 'Créer une entreprise',
        description: 'Créez votre première entreprise pour organiser vos projets',
        completed: false,
      },
      {
        id: 3,
        title: 'Créer ma première tâche',
        description: 'Ajoutez votre première tâche à un projet',
        completed: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header avec bouton de connexion */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary-600">MyMind</h1>
            <span className="text-sm text-secondary-500">Task Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur MyMind
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Gérez vos projets et tâches efficacement. Organisez votre travail en équipe.
          </p>
        </div>

        {/* Projet d'exemple */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {demoProject.name}
                </h3>
                <p className="text-secondary-600">
                  Projet d'exemple pour découvrir MyMind
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {demoProject.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {task.title}
                      </h4>
                      <p className="text-sm text-secondary-600">{task.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {task.completed ? (
                        <span className="text-success-500">✓</span>
                      ) : (
                        <span className="text-secondary-400">○</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Call to action */}
          <div className="text-center mt-8">
            <p className="text-secondary-600 mb-4">
              Prêt à commencer ? Créez votre compte gratuitement
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                className="px-8 py-3 text-lg"
              >
                Créer un compte
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/login')}
                className="px-8 py-3 text-lg"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-secondary-600">
          <p>© {new Date().getFullYear()} MyMind. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

