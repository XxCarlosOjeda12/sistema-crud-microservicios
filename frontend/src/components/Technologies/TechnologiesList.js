// src/components/Technologies/TechnologiesList.js - REFACTORIZADO
import React, { useState, useEffect } from 'react';
import { technologiesService } from '../../services/api';
import useForm from '../../hooks/useForm';
import useApiCall from '../../hooks/useApiCall';
import { validateTechnologyForm } from '../../utils/validators';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import ConfirmDialog from '../common/ConfirmDialog';
import TechnologiesFilters from './TechnologiesFilters';
import TechnologiesGrid from './TechnologiesGrid';
import TechnologyForm from './TechnologyForm';

const TechnologiesList = () => {
  const [technologies, setTechnologies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ sector: '', adoptionLevel: '' });
  
  const { loading, error, success, execute, clearError } = useApiCall();
  
  const initialFormValues = {
    name: '',
    sector: '',
    description: '',
    adoptionLevel: ''
  };
  
  const { 
    values: formData, 
    errors: formErrors, 
    handleChange, 
    handleSubmit, 
    reset: resetForm,
    setFormValues 
  } = useForm(initialFormValues, validateTechnologyForm);

  useEffect(() => {
    loadTechnologies();
  }, [filters]);

  const loadTechnologies = async () => {
    try {
      const cleanFilters = {};
      if (filters.sector) cleanFilters.sector = filters.sector;
      if (filters.adoptionLevel) cleanFilters.adoptionLevel = filters.adoptionLevel;
      
      const response = await execute(() => technologiesService.getAll(cleanFilters));
      setTechnologies(response.data || []);
    } catch (err) {
      // El error ya está manejado por useApiCall
    }
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        description: values.description || null
      };
      
      if (editingTechnology) {
        await execute(
          () => technologiesService.update(editingTechnology.id, dataToSubmit),
          'Tecnología actualizada exitosamente'
        );
      } else {
        await execute(
          () => technologiesService.create(dataToSubmit),
          'Tecnología creada exitosamente'
        );
      }
      
      setShowModal(false);
      resetForm();
      setEditingTechnology(null);
      loadTechnologies();
    } catch (err) {
      // El error ya está manejado por useApiCall
    }
  };

  const handleEdit = (technology) => {
    setEditingTechnology(technology);
    setFormValues({
      name: technology.name,
      sector: technology.sector,
      description: technology.description || '',
      adoptionLevel: technology.adoption_level
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await execute(
        () => technologiesService.delete(deleteConfirm),
        'Tecnología eliminada exitosamente'
      );
      setDeleteConfirm(null);
      loadTechnologies();
    } catch (err) {
      // El error ya está manejado por useApiCall
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingTechnology(null);
    setShowModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ sector: '', adoptionLevel: '' });
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Gestión de Tecnologías</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Nueva Tecnología
          </button>
        </div>
      </div>

      {/* Alertas */}
      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {/* Filtros */}
      <TechnologiesFilters 
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
      />

      {/* Cargar o tablar */}
      {loading ? (
        <Spinner fullScreen />
      ) : (
        <TechnologiesGrid 
          technologies={technologies}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      {/* Crear/Editar Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTechnology ? 'Editar Tecnología' : 'Nueva Tecnología'}
      >
        <TechnologyForm
          formData={formData}
          errors={formErrors}
          onChange={handleChange}
          onSubmit={handleSubmit(handleCreateOrUpdate)}
          onCancel={() => setShowModal(false)}
          isEditing={!!editingTechnology}
        />
      </Modal>

      {/* Borrar Confirmacion */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta tecnología? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        danger
      />
    </div>
  );
};

export default TechnologiesList;