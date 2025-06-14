import { SubModule, Module } from '../models/index.js';

// Obtener todos los submódulos con su módulo
export const getAllSubModules = async (req, res) => {
  try {
    const submodules = await SubModule.findAll({
      include: [{ model: Module, as: 'module' }]
    });
    res.json(submodules);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los submódulos' });
  }
};

// Obtener un submódulo por ID
export const getSubModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const submodule = await SubModule.findByPk(id, {
      include: [{ model: Module, as: 'module' }]
    });
    if (!submodule) {
      return res.status(404).json({ error: 'Submódulo no encontrado' });
    }
    res.json(submodule);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el submódulo' });
  }
};

// Crear un nuevo submódulo
export const createSubModule = async (req, res) => {
  try {
    const { name, description, duration, order, id_module } = req.body;

    const newSubModule = await SubModule.create({
      name,
      description,
      duration,
      order,
      id_module
    });

    res.status(201).json(newSubModule);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el submódulo' });
  }
};

// Actualizar un submódulo
export const updateSubModule = async (req, res) => {
  const { id } = req.params;
  try {
    const submodule = await SubModule.findByPk(id);
    if (!submodule) {
      return res.status(404).json({ error: 'Submódulo no encontrado' });
    }

    await submodule.update(req.body);
    res.json(submodule);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el submódulo' });
  }
};

// Eliminar un submódulo
export const deleteSubModule = async (req, res) => {
  const { id } = req.params;
  try {
    const submodule = await SubModule.findByPk(id);
    if (!submodule) {
      return res.status(404).json({ error: 'Submódulo no encontrado' });
    }

    await submodule.destroy();
    res.json({ message: 'Submódulo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el submódulo' });
  }
};
