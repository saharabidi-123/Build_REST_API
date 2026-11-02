const express = require('express');
const { initializeDatabase } = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour analyser le corps des requêtes JSON
app.use(express.json());

// Montage des routes sous le préfixe /api/projects
app.use('/api/projects', projectRoutes);

// Initialisation DB et démarrage du serveur
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur API lancé sur http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Échec de l'initialisation de la base de données :", err);
    });