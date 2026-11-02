const { getDb } = require('../config/database');

const ProjectModel = {
    // Récupérer tous les projets
    async getAll() {
        const db = await getDb();
        return await db.all('SELECT * FROM projects');
    },

    // Récupérer un projet par son ID
    async getById(id) {
        const db = await getDb();
        return await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    },

    // Créer un nouveau projet
    async create(projectData) {
        const db = await getDb();
        const { name, description, progress, status } = projectData;

        const result = await db.run(
            `INSERT INTO projects (name, description, progress, status) VALUES (?, ?, ?, ?)`,
            [
                name,
                description || null,
                progress !== undefined ? progress : 0,
                status || 'pending'
            ]
        );

        return await this.getById(result.lastID);
    },

    // Mettre à jour un projet existant
    async update(id, projectData) {
        const db = await getDb();
        const { name, description, progress, status } = projectData;

        await db.run(
            `UPDATE projects 
             SET name = ?, description = ?, progress = ?, status = ? 
             WHERE id = ?`,
            [name, description || null, progress, status, id]
        );

        return await this.getById(id);
    },

    // Supprimer un projet
    async delete(id) {
        const db = await getDb();
        await db.run('DELETE FROM projects WHERE id = ?', [id]);
    }
};

module.exports = ProjectModel;