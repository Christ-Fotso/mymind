import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnterpriseCard from '../components/EnterpriseCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { enterpriseAPI } from '../services/api';

const EnterpriseView = () => {
  const navigate = useNavigate();
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    loadEnterprises();
  }, []);

  const loadEnterprises = async () => {
    try {
      setLoading(true);
      const data = await enterpriseAPI.getAll();
      setEnterprises(data);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEnterprise(null);
    setFormData({ name: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (enterprise) => {
    setEditingEnterprise(enterprise);
    setFormData({
      name: enterprise.name,
      address: enterprise.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingEnterprise) {
        await enterpriseAPI.update(editingEnterprise.id, formData);
      } else {
        await enterpriseAPI.create(formData);
      }
      setIsModalOpen(false);
      loadEnterprises();
    } catch (error) {
      alert(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      try {
        await enterpriseAPI.delete(id);
        loadEnterprises();
      } catch (error) {
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleView = (id) => {
    navigate(`/enterprises/${id}/projects`);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Entreprises</h2>
        <Button onClick={handleCreate}>Nouvelle entreprise</Button>
      </div>

      {enterprises.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune entreprise trouvée
        </div>
      ) : (
        <div>
          {enterprises.map((enterprise) => (
            <EnterpriseCard
              key={enterprise.id}
              enterprise={enterprise}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <Modal
        title={editingEnterprise ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
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
          label="Adresse"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default EnterpriseView;

