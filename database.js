const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
// Le fichier maBaseDeDonnees.sqlite sera créé s'il n'existe pas
const db = new sqlite3.Database('./maBaseDeDonnees.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        // Création de la table personnes si elle n'existe pas
        db.run('CREATE TABLE IF NOT EXISTS personnes (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, adresse TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        
    }
});
        /*db.run('CREATE TABLE IF NOT EXISTS personnes (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL)', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                // Insertion de données initiales si la table vient d'être créée (ou est vide)
                // Pour éviter les duplications, on pourrait vérifier si la table est vide avant d'insérer
                const personnes = ['Bob', 'Alice', 'Charlie'];
                personnes.forEach((nom) => {
                    // Vérifier si le nom existe déjà pour éviter les doublons lors de redémarrages
                    db.get('SELECT nom FROM personnes WHERE nom = ?', [nom], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                        if (!row) { // Insérer seulement si le nom n'existe pas
                            db.run('INSERT INTO personnes (nom) VALUES (?)', [nom], function(errInsert) {
                                if (errInsert) {
                                    console.error(errInsert.message);
                                } else {
                                    console.log(`Ligne insérée avec ID: ${this.lastID}`);
                                }
                            });
                        }
                    });
                });
            }
        });*/
    }
});

module.exports = db;