import Module from '../models/module.model.js';
import { validationResult } from 'express-validator';

import ModuleTeacher from '../models/module.teacher.model.js';

// import multer from 'multer';
// import upload from
class ModuleController {
    /**
     * Obtiene todos los módulos
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    // static async getAll(req, res) {
    //     try {
    //         const modules = await Module.getAll();
    //         res.status(200).json({
    //             success: true,
    //             data: modules
    //         });
    //     } catch (error) {
    //         console.error('Error en getAllModules:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Error al obtener módulos',
    //             error: error.message
    //         });
    //     }
    // }
    // static async getAll(req, res) {
    //     try {
    //         const modules = await Module.getAll(); // Debe incluir teachers y submodules

    //         const result = modules.map(module => {
    //             const profesores = module.teachers.map(t => ({
    //                 id_teacher: t.id_teacher,
    //                 nombre: t.User?.first_name + ' ' + t.User?.last_name,
    //             }));

    //             return {
    //                 ...module.toJSON(),
    //                 submodules: module.submodules.map(sub => ({
    //                     ...sub.toJSON(),
    //                     profesor: profesores[0] || null  // asignamos el primero
    //                 }))
    //             };
    //         });

    //         res.status(200).json({
    //             success: true,
    //             data: result
    //         });

    //     } catch (error) {
    //         console.error('Error en getAllModules:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Error al obtener módulos',
    //             error: error.message
    //         });
    //     }
    // }

    static async getAll(req, res) {
        try {
          const modules = await Module.getAll();  // Traés los módulos con relaciones
          
          // Transformás para incluir profesores correctamente en submódulos y en el módulo
          const result = modules.map(module => {
            const profesores = module.moduleTeachers.map(mt => ({
              id_teacher: mt.teacher.id_teacher,
              nombre: mt.teacher.User.first_name + ' ' + mt.teacher.User.last_name,
            }));
    
            return {
              ...module.toJSON(),
              submodules: module.submodules.map(sub => ({
                ...sub.toJSON(),
                profesor: profesores[0] || null  // asignar lógica real aquí si querés
              })),
              teachers: profesores
            };
          });
    
          res.status(200).json({
            success: true,
            data: result
          });
        } catch (error) {
          console.error('Error en getAllModules:', error);
          res.status(500).json({
            success: false,
            message: 'Error al obtener módulos',
            error: error.message
          });
        }
      }


    /**
     * Crea un nuevo módulo
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async create(req, res) {
        try {
            console.log(req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                return res.status(400).json({
                    
                    success: false,
                    message: 'Error de validación',
                    errors: errors.array()
                });
            }

            const moduleData = req.body;
            const result = await Module.create(moduleData);

            res.status(201).json({
                success: true,
                message: 'Módulo creado exitosamente',
                data: result
            });
        } catch (error) {
            console.error('Error en createModule:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear módulo',
                error: error.message
            });
        }
    }

    /**
     * Elimina un módulo
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Module.delete(id);

            res.status(200).json({
                success: true,
                message: 'Módulo eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error en deleteModule:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar módulo',
                error: error.message
            });
        }
    }

    /**
     * Obtiene estadísticas de módulos
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getStats(req, res) {
        try {
            const stats = await Module.getStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error en getModuleStats:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    }

    static async enrollStudent (req, res) {
        try {
            const { moduleId, studentId } = req.body;
    
            if (!moduleId || !studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos: moduleId y studentId son requeridos'
                });
            }
    
            const result = await Module.enrollStudent(moduleId, studentId);
    
            res.status(200).json({
                success: true,
                message: 'Estudiante inscrito en el módulo correctamente',
                data: result
            });
        } catch (error) {
            console.error('Error en enrollStudentModule:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al inscribir al estudiante en el módulo'
            });
        }
    }

   


}

export const enrollStudent = async (req, res) => {

    try {
  
      const { courseId, studentId } = req.body;
  
      if (!courseId || !studentId) {
  
        return res.status(400).json({
          success: false,
          message: 'Faltan datos: courseId y studentId son requeridos'
        });
      }
  
      const result = await Course.enrollStudent(courseId, studentId);
  
      res.json({
        success: true,
        message: 'Estudiante inscrito correctamente',
        data:result
      });
    } catch (error) {
      console.error('Error in enrollStudent:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al inscribir al estudiante'
      });
    }
  }

  export const enrollStudentModule = async (req, res) => {
    try {
        const { moduleId, studentId } = req.body;

        if (!moduleId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos: moduleId y studentId son requeridos'
            });
        }

        const result = await Module.enrollStudent(moduleId, studentId);

        res.status(200).json({
            success: true,
            message: 'Estudiante inscrito en el módulo correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error en enrollStudentModule:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al inscribir al estudiante en el módulo'
        });
    }
};


export default ModuleController; 