const express = require('express');
const db = require('./database');
const session = require('express-session'); 
const Keycloak = require('keycloak-connect'); 

const app = express();

const memoryStore = new session.MemoryStore(); 
app.use(session({
    secret: 'unAutreSecretPourLaSession', 
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));


const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');

app.use(keycloak.middleware({
    logout: '/logout', 
    admin: '/'        
}));

app.use(express.json());
const PORT = 3000;

app.get('/', (req, res) => {
    res.json("Registre de personnes! Choisissez le bon routage!");
});

app.get('/secure', keycloak.protect(), (req, res) => {
    res.json({ message: 'Vous êtes authentifié !', user: req.kauth.grant.access_token.content.preferred_username });
});


app.get('/personnes', keycloak.protect(), (req, res) => { 
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});


app.post('/personnes', keycloak.protect(), (req, res) => {
    const { nom, adresse } = req.body;
    if (!nom) {
        res.status(400).json({ "error": "Le nom est requis" });
        return;
    }
    db.run('INSERT INTO personnes (nom, adresse) VALUES (?, ?)', [nom, adresse], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, nom: nom, adresse: adresse }
        });
    });
});

app.put('/personnes/:id', keycloak.protect(), (req, res) => {
    const id = req.params.id;
    const { nom, adresse } = req.body;
    if (!nom) {
        res.status(400).json({ "error": "Le nom est requis" });
        return;
    }
    db.run('UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?', [nom, adresse, id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
             res.status(404).json({ "error": "Personne non trouvée pour la mise à jour" });
             return;
        }
        res.json({ "message": "success", data: { id:id, nom:nom, adresse:adresse } });
    });
});

app.delete('/personnes/:id', keycloak.protect(), (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM personnes WHERE id = ?', id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
         if (this.changes === 0) {
             res.status(404).json({ "error": "Personne non trouvée pour la suppression" });
             return;
        }
        res.json({ "message": "success" });
    });
});


app.get('/personnes/:id', keycloak.protect(), (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ "error": "Personne non trouvée" });
            return;
        }
        res.json({ "message": "success", "data": row });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



//const express = require('express');
//const db = require('./database'); // Notre module database.js

//const app = express();
//app.use(express.json()); // Pour parser les corps de requête JSON

//const PORT = 3000;

//// Route racine
//app.get('/', (req, res) => {
//    res.json("Registre de personnes! Choisissez le bon routage!");
//});

//// Récupérer toutes les personnes
//app.get('/personnes', (req, res) => {
//    db.all("SELECT * FROM personnes", [], (err, rows) => {
//        if (err) {
//            res.status(400).json({ "error": err.message });
//            return;
//        }
//        res.json({
//            "message": "success",
//            "data": rows
//        });
//    });
//});

//// Récupérer une personne par ID
//app.get('/personnes/:id', (req, res) => {
//    const id = req.params.id;
//    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
//        if (err) {
//            res.status(400).json({ "error": err.message });
//            return;
//        }
//        if (!row) {
//            res.status(404).json({ "error": "Personne non trouvée" });
//            return;
//        }
//        res.json({
//            "message": "success",
//            "data": row
//        });
//    });
//});

// Créer une nouvelle personne
/*app.post('/personnes', (req, res) => {
    const nom = req.body.nom;
    if (!nom) {
        res.status(400).json({ "error": "Le nom est requis" });
        return;
    }
    db.run('INSERT INTO personnes (nom) VALUES (?)', [nom], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": {
                id: this.lastID,
                nom: nom // Ajouté pour une réponse plus complète
            }
        });
    });
});*/
//// NOUVELLE route POST
//app.post('/personnes', (req, res) => {
//    const { nom, adresse } = req.body; // Récupère nom et adresse
//    if (!nom) { // L'adresse peut être optionnelle, mais le nom reste requis
//        res.status(400).json({ "error": "Le nom est requis" });
//        return;
//    }
//    db.run('INSERT INTO personnes (nom, adresse) VALUES (?, ?)', [nom, adresse], function(err) {
//        if (err) {
//            res.status(400).json({ "error": err.message });
//            return;
//        }
//        res.json({
//            "message": "success",
//            "data": {
//                id: this.lastID,
//                nom: nom,
//                adresse: adresse
//            }
//        });
//    });
//});

// Mettre à jour une personne
/*app.put('/personnes/:id', (req, res) => {
    const id = req.params.id;
    const nom = req.body.nom;
    if (!nom) {
        res.status(400).json({ "error": "Le nom est requis" });
        return;
    }
    db.run('UPDATE personnes SET nom = ? WHERE id = ?', [nom, id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
             res.status(404).json({ "error": "Personne non trouvée pour la mise à jour" });
             return;
        }
        res.json({
            "message": "success",
            "data": { // Ajouté pour une réponse plus complète
                id: id,
                nom: nom
            }
        });
    });
});*/


// NOUVELLE route PUT
//app.put('/personnes/:id', (req, res) => {
//    const id = req.params.id;
//    const { nom, adresse } = req.body; 
//    if (!nom) { 
//        res.status(400).json({ "error": "Le nom est requis" });
//        return;
//    }
//    db.run('UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?', [nom, adresse, id], function(err) {
//        if (err) {
//            res.status(400).json({ "error": err.message });
//            return;
//        }
//        if (this.changes === 0) {
//             res.status(404).json({ "error": "Personne non trouvée pour la mise à jour" });
//             return;
//        }
//        res.json({
//            "message": "success",
//            "data": {
//                id: id,
//                nom: nom,
//                adresse: adresse
//            }
//        });
//    });
//});

// Supprimer une personne
//app.delete('/personnes/:id', (req, res) => {
//  const id = req.params.id;
//  db.run('DELETE FROM personnes WHERE id = ?', id, function(err) {
//      if (err) {
//            res.status(400).json({ "error": err.message });
//            return;
//      }
//       if (this.changes === 0) {
//             res.status(404).json({ "error": "Personne non trouvée pour la suppression" });
//             return;
//        }
//        res.json({ "message": "success" });
//    });
//});

//// Démarrer le serveur
//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//});
