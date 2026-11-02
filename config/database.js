const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbPromise = null;

async function initializeDatabase() {
    if (!dbPromise) {
        dbPromise = (async () => {
            const db = await open({
                filename: path.join(__dirname, '../database.sqlite'),
                driver: sqlite3.Database
            });

            // Création de la table 'projects' conforme au cahier des charges
            await db.exec(`
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    progress INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'pending'
                )
            `);

            // Seed automatique si la table est vide
            const countResult = await db.get("SELECT COUNT(*) as count FROM projects");
            
            if (countResult.count === 0) {
                await db.run(
                    `INSERT INTO projects (name, description, progress, status) VALUES 
                    ('E-Commerce Website', 'Building a full-stack platform using Node.js', 25, 'in_progress'),
                    ('Mobile App Prototype', 'UI design and Flutter setup for local clinic', 0, 'pending'),
                    ('AI Registration System', 'Form integration and processing module', 100, 'completed')`
                );
                console.log("Table 'projects' initialisée avec succès !");
            }

            return db;
        })();
    }
    return dbPromise;
}

async function getDb() {
    if (!dbPromise) {
        return await initializeDatabase();
    }
    return await dbPromise;
}

module.exports = { initializeDatabase, getDb };