const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Servir HTML, CSS, JS et images
app.use(express.static(__dirname));

// ==========================
// Connexion à MySQL
// ==========================

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ecommerce",
    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined
});

// ==========================
// Vérifier la connexion
// ==========================

pool.getConnection((err, connection) => {

    if (err) {
        console.error("Erreur de connexion MySQL :", err);
        return;
    }

    console.log("Connexion à MySQL réussie !");

    connection.release();
});

// ==========================
// Récupérer les produits
// ==========================

app.get("/api/produits", (req, res) => {

    const sql = `
        SELECT
            id,
            nom,
            description,
            prix,
            image,
            stock
        FROM produits
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                erreur: "Erreur SQL"
            });
        }

        res.json(results);
    });
});

//===========================
// ajouter un produit
//===========================

app.post("/api/produits", (req, res) => {

    const {
        nom,
        description,
        prix,
        image,
        stock
    } = req.body;

    const sql = `
        INSERT INTO produits
        (nom, description, prix, image, stock)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nom,
            description || "",
            prix,
            image || "",
            stock || 0
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Erreur ajout produit :",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                id: result.insertId
            });

        }
    );

});

//===========================
// modifier un produit
//===========================

app.put("/api/produits/:id", (req, res) => {

    const id = req.params.id;

    const {
        nom,
        description,
        prix,
        image,
        stock
    } = req.body;

    const sql = `
        UPDATE produits
        SET
            nom = ?,
            description = ?,
            prix = ?,
            image = ?,
            stock = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            nom,
            description || "",
            prix,
            image || "",
            stock || 0,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Erreur modification produit :",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true
            });

        }
    );

});

// ==========================
// supprime un produit
// ==========================

app.delete("/api/produits/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM produits
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "Erreur suppression produit :",
                    err
                );

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true
            });

        }
    );

});


// ==========================
// RECEVOIR UNE COMMANDE
// ==========================

app.post("/api/commandes", (req, res) => {

    const {
        client,
        produits
    } = req.body;


    // Vérification minimale

    if (
        !client ||
        !client.prenom ||
        !client.nom ||
        !client.telephone ||
        !client.wilaya ||
        !client.adresse ||
        !Array.isArray(produits) ||
        produits.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Informations de commande incomplètes"
        });

    }


    // ==========================
    // 1. ENREGISTRER LE CLIENT
    // ==========================

    const sqlClient = `
        INSERT INTO clients
        (
            prenom,
            nom,
            telephone,
            wilaya,
            ville,
            adresse,
            email,
            code_postal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sqlClient,
        [
            client.prenom,
            client.nom,
            client.telephone,
            client.wilaya,
            client.ville || "",
            client.adresse,
            client.email || "",
            client.codePostal || ""
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Erreur client :",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Erreur lors de l'enregistrement du client"
                });

            }


            const clientId = result.insertId;


            // ==========================
            // 2. RÉCUPÉRER LES PRIX
            // ==========================

            const ids = produits.map(
                p => Number(p.id)
            );


            const placeholders =
                ids.map(() => "?").join(",");


            const sqlProduits = `
                SELECT id, nom, prix
                FROM produits
                WHERE id IN (${placeholders})
            `;


            db.query(
                sqlProduits,
                ids,
                (err, productsDB) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Erreur lors de la récupération des produits"
                        });

                    }


                    // ==========================
                    // 3. CALCULER LE TOTAL
                    // ==========================

                    let total = 0;


                    produits.forEach(item => {

                        const product =
                            productsDB.find(
                                p =>
                                    Number(p.id) ===
                                    Number(item.id)
                            );


                        if (product) {

                            const quantity =
                                Number(item.quantity) || 1;


                            total +=
                                Number(product.prix) *
                                quantity;

                        }

                    });


                    // ==========================
                    // 4. CRÉER LA COMMANDE
                    // ==========================

                    const sqlCommande = `
                        INSERT INTO commandes
                        (
                            client_id,
                            total,
                            statut,
                            notes,
                            date_commande
                        )
                        VALUES (?, ?, ?, ?, NULL)
                    `;


                    db.query(
                        sqlCommande,
                        [
                            clientId,
                            total,
                            "Nouvelle",
                            client.notes || ""
                        ],
                        (err, result) => {

                            if (err) {

                                console.error(err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Erreur lors de création de la commande"
                                });

                            }


                            const commandeId =
                                result.insertId;


                            // ==========================
                            // 5. ENREGISTRER LES PRODUITS
                            // ==========================

                            let detailsAjoutes = 0;


                            produits.forEach(item => {

                                const product =
                                    productsDB.find(
                                        p =>
                                            Number(p.id) ===
                                            Number(item.id)
                                    );


                                if (!product) return;


                                const quantity =
                                    Number(item.quantity) || 1;


                                const sqlDetail = `
                                    INSERT INTO commande_details
                                    (
                                        commande_id,
                                        produit_id,
                                        quantite,
                                        prix_unitaire
                                    )
                                    VALUES (?, ?, ?, ?)
                                `;


                                db.query(
                                    sqlDetail,
                                    [
                                        commandeId,
                                        product.id,
                                        quantity,
                                        product.prix
                                    ],
                                    (err) => {

                                        if (err) {

                                            console.error(err);

                                        }


                                        detailsAjoutes++;


                                        // Quand tous les produits
                                        // sont enregistrés

                                        if (
                                            detailsAjoutes ===
                                            produits.length
                                        ) {

                                            res.json({

                                                success: true,

                                                message:
                                                    "Commande enregistrée",

                                                commandeId:
                                                    commandeId,

                                                total:
                                                    total

                                            });

                                        }

                                    }
                                );

                            });

                        }
                    );

                }
            );

        }
    );

});


// ========================================
// RÉCUPÉRER LES COMMANDES
// ========================================

app.get("/api/commandes", (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.total,
            c.statut,
            c.stock_deduit,
            c.date_commande,
            c.date_validation,
            cl.prenom,
            cl.nom,
            cl.telephone,
            cl.wilaya,
            cl.ville,
            cl.adresse,
            cl.email
        FROM commandes c

        INNER JOIN clients cl
            ON c.client_id = cl.id

        ORDER BY c.date_commande DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Erreur récupération commandes :",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Erreur serveur"
            });

        }


        res.json(results);

    });

});

// ========================================
// MODIFIER LE STATUT D'UNE COMMANDE
// ========================================

app.put("/api/commandes/:id/statut", (req, res) => {

    const id = req.params.id;

    const { statut } = req.body;


    const statutsAutorises = [
        "Nouvelle",
        "Confirmée",
        "En préparation",
        "Expédiée",
        "Livrée",
        "Annulée"
    ];


    if (!statutsAutorises.includes(statut)) {

        return res.status(400).json({
            success: false,
            message: "Statut invalide"
        });

    }


    const sql = `
        UPDATE commandes
        SET statut = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [statut, id],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Erreur serveur"
                });

            }


            res.json({
                success: true,
                message: "Statut modifié"
            });

        }
    );

});


// ========================================
// DÉTAILS D'UNE COMMANDE
// ========================================

app.get("/api/commandes/:id/details", (req, res) => {

    const commandeId = req.params.id;

    const sql = `
        SELECT
            cd.produit_id,
            cd.quantite,
            cd.prix_unitaire,
            p.nom,
            p.image
        FROM commande_details cd

        INNER JOIN produits p
            ON cd.produit_id = p.id

        WHERE cd.commande_id = ?

    `;

    db.query(
        sql,
        [commandeId],
        (err, results) => {

            if (err) {

                console.error(
                    "Erreur détails commande :",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Erreur serveur"
                });

            }

            res.json(results);

        }
    );

});

// ==========================
// Calcul apres validation 
// ==========================


app.post("/api/commandes/:id/valider", async (req, res) => {

    const commandeId = req.params.id;

    const connection = await pool.promise().getConnection();

    try {

        await connection.beginTransaction();

        // 1. Vérifier la commande
        const [commandes] = await connection.query(
            `SELECT id, statut, stock_deduit
             FROM commandes
             WHERE id = ?
             FOR UPDATE`,
            [commandeId]
        );

        if (commandes.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Commande introuvable"
            });
        }

        const commande = commandes[0];

        // 2. Vérifier le statut
        if (commande.statut !== "Livrée") {
            await connection.rollback();

            return res.status(400).json({
                message: "La commande doit être marquée comme Livrée."
            });
        }

        // 3. Vérifier si le stock a déjà été déduit
        if (commande.stock_deduit === 1) {
            await connection.rollback();

            return res.status(400).json({
                message: "Cette commande a déjà été validée."
            });
        }

        // 4. Récupérer les produits commandés
        const [details] = await connection.query(
            `SELECT produit_id, quantite
             FROM commande_details
             WHERE commande_id = ?`,
            [commandeId]
        );

        // 5. Vérifier le stock disponible
        for (const detail of details) {

            const [produits] = await connection.query(
                `SELECT id, nom, stock
                 FROM produits
                 WHERE id = ?
                 FOR UPDATE`,
                [detail.produit_id]
            );

            if (produits.length === 0) {
                throw new Error(
                    `Produit ${detail.produit_id} introuvable`
                );
            }

            const produit = produits[0];

            if (produit.stock < detail.quantite) {
                throw new Error(
                    `Stock insuffisant pour : ${produit.nom}`
                );
            }
        }

        // 6. Déduire le stock
        for (const detail of details) {

            await connection.query(
                `UPDATE produits
                 SET stock = stock - ?
                 WHERE id = ?`,
                [
                    detail.quantite,
                    detail.produit_id
                ]
            );
        }

        // 7. Marquer la commande comme validée
        // et enregistrer la date de validation
        await connection.query(
            `UPDATE commandes
             SET 
             stock_deduit = 1,
             date_validation = NOW()
             WHERE id = ?`,
            [commandeId]
        );

        await connection.commit();

        res.json({
            success: true,
            message: "Commande validée et stock mis à jour."
        });

    } catch (error) {

        await connection.rollback();

        console.error("Erreur validation commande :", error);

        res.status(500).json({
            message: error.message
        });

    } finally {

        connection.release();
    }
});

// ==========================
// Démarrer le serveur
// ==========================

app.listen(3000, () => {


    console.log(
        "Serveur démarré sur http://localhost:3000"
    );


});

// Modifier le port dans server.js pour Rener
//============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
