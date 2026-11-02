const ProjectModel = require('../models/projectModel');

// Ensemble des statuts autorisés
const ALLOWED_STATUSES = ['pending', 'in_progress', 'completed'];

const projectController = {
    // GET /api/projects
    async getAllProjects(req, res) {
        try {
            const projects = await ProjectModel.getAll();
            return res.status(200).json(projects);
        } catch (error) {
            console.error("Erreur getAllProjects:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    // GET /api/projects/:id
    async getProjectById(req, res) {
        try {
            const { id } = req.params;

            // Validation de l'ID (doit être un entier positif)
            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({ message: "L'identifiant fourni n'est pas un entier valide." });
            }

            const project = await ProjectModel.getById(id);
            if (!project) {
                return res.status(404).json({ message: "Projet non trouvé." });
            }

            return res.status(200).json(project);
        } catch (error) {
            console.error("Erreur getProjectById:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    // POST /api/projects
    async createProject(req, res) {
        try {
            const { name, description, progress, status } = req.body;

            // Validations
            if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
                return res.status(400).json({ message: "Le nom du projet est requis (3 à 100 caractères)." });
            }

            if (description && (typeof description !== 'string' || description.length > 500)) {
                return res.status(400).json({ message: "La description ne peut pas dépasser 500 caractères." });
            }

            if (progress !== undefined) {
                if (!Number.isInteger(Number(progress)) || progress < 0 || progress > 100) {
                    return res.status(400).json({ message: "Le champ 'progress' doit être un entier compris entre 0 et 100." });
                }
            }

            if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({ message: "Statut invalide. Valeurs autorisées : pending, in_progress, completed." });
            }

            const newProject = await ProjectModel.create({ name: name.trim(), description, progress, status });
            return res.status(201).json(newProject);
        } catch (error) {
            console.error("Erreur createProject:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    // PUT /api/projects/:id
    async updateProject(req, res) {
        try {
            const { id } = req.params;

            // 1. Validation de l'ID
            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({ message: "L'identifiant fourni n'est pas un entier valide." });
            }

            // 2. Vérification de l'existence de la ressource
            const existingProject = await ProjectModel.getById(id);
            if (!existingProject) {
                return res.status(404).json({ message: "Projet non trouvé." });
            }

            const { name, description, progress, status } = req.body;

            // 3. Validations du payload
            if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
                return res.status(400).json({ message: "Le nom du projet est requis (3 à 100 caractères)." });
            }

            if (description && (typeof description !== 'string' || description.length > 500)) {
                return res.status(400).json({ message: "La description ne peut pas dépasser 500 caractères." });
            }

            if (progress === undefined || !Number.isInteger(Number(progress)) || progress < 0 || progress > 100) {
                return res.status(400).json({ message: "Le champ 'progress' doit être un entier compris entre 0 et 100." });
            }

            if (!status || !ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({ message: "Le statut est requis et doit appartenir à : pending, in_progress, completed." });
            }

            const updatedProject = await ProjectModel.update(id, { name: name.trim(), description, progress, status });
            return res.status(200).json(updatedProject);
        } catch (error) {
            console.error("Erreur updateProject:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    // DELETE /api/projects/:id
    async deleteProject(req, res) {
        try {
            const { id } = req.params;

            // Validation de l'ID
            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({ message: "L'identifiant fourni n'est pas un entier valide." });
            }

            // Vérification de l'existence
            const existingProject = await ProjectModel.getById(id);
            if (!existingProject) {
                return res.status(404).json({ message: "Projet non trouvé." });
            }

            await ProjectModel.delete(id);
            return res.status(200).json({ message: "Projet supprimé avec succès." });
        } catch (error) {
            console.error("Erreur deleteProject:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
};

module.exports = projectController;