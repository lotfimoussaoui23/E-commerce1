// ========================================
// HISTORIQUE DES VENTES
// ========================================


let commandes = [];


// ========================================
// CHARGER LES COMMANDES
// ========================================

async function chargerCommandes() {

    try {

        const response =
            await fetch("/api/commandes");


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );

        }


        commandes =
            await response.json();


        console.log(
            "Commandes récupérées :",
            commandes
        );


        await afficherVentes(
            commandes
        );


    } catch (error) {

        console.error(
            "Erreur chargement commandes :",
            error
        );


        document.getElementById(
            "tableauVentes"
        ).innerHTML = `

            <tr>

                <td colspan="4">

                    ❌ Impossible de charger
                    l'historique des ventes.

                </td>

            </tr>

        `;

    }

}


// ========================================
// RÉCUPÉRER LES DÉTAILS D'UNE COMMANDE
// ========================================

async function recupererDetails(
    commandeId
) {

    const response =
        await fetch(
            `/api/commandes/${commandeId}/details`
        );


    if (!response.ok) {

        throw new Error(
            "Erreur lors de la récupération des détails"
        );

    }


    return await response.json();

}


// ========================================
// AFFICHER LES VENTES
// ========================================

async function afficherVentes(
    liste
) {

    const tableau =
        document.getElementById(
            "tableauVentes"
        );


    const totalElement =
        document.getElementById(
            "totalVentes"
        );


    tableau.innerHTML = "";


    let totalGeneral = 0;


    // ====================================
    // AUCUNE VENTE
    // ====================================

    if (liste.length === 0) {

        tableau.innerHTML = `

            <tr>

                <td colspan="4">

                    Aucune vente trouvée.

                </td>

            </tr>

        `;


        totalElement.innerHTML = `

            💰 TOTAL :

            <strong>
                0 DA
            </strong>

        `;


        return;

    }


    // ====================================
    // PARCOURIR LES COMMANDES
    // ====================================

    for (
        const commande of liste
    ) {

        try {


            // ==================================
            // RÉCUPÉRER LES PRODUITS
            // ==================================

            const details =
                await recupererDetails(
                    commande.id
                );


            // ==================================
            // DATE DE LA COMMANDE
            // ==================================

            const date =
                formaterDate(
                    commande.date_commande
                );


            // ==================================
            // PRODUITS DE LA COMMANDE
            // ==================================

            details.forEach(
                detail => {


                    const quantite =
                        Number(
                            detail.quantite
                        ) || 0;


                    const prix =
                        Number(
                            detail.prix_unitaire
                        ) || 0;


                    const totalProduit =
                        quantite * prix;


                    // Ajouter au total général

                    totalGeneral +=
                        totalProduit;


                    // ==================================
                    // CRÉER LA LIGNE
                    // ==================================

                    const ligne =
                        document.createElement(
                            "tr"
                        );


                    ligne.innerHTML = `

                        <td>
                            ${date}
                        </td>


                        <td>
                            ${detail.nom}
                        </td>


                        <td class="quantite">
                            ${quantite}
                        </td>


                        <td class="prix">
                            ${totalProduit.toLocaleString()}
                            DA
                        </td>

                    `;


                    tableau.appendChild(
                        ligne
                    );

                }
            );


        } catch (error) {

            console.error(
                "Erreur commande :",
                commande.id,
                error
            );

        }

    }


    // ====================================
    // AFFICHER LE TOTAL
    // ====================================

    totalElement.innerHTML = `

        💰 TOTAL :

        <strong>

            ${totalGeneral.toLocaleString()}
            DA

        </strong>

    `;

}


// ========================================
// FORMATER LA DATE
// ========================================

function formaterDate(
    dateSQL
) {

    // Si aucune date

    if (!dateSQL) {

        return "Date inconnue";

    }


    const date =
        new Date(dateSQL);


    // Date invalide

    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "Date inconnue";

    }


    return (

        date.toLocaleDateString(
            "fr-FR"
        )

        +

        " "

        +

        date.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )

    );

}


// ========================================
// FILTRER PAR PÉRIODE
// ========================================

async function filtrerParPeriode() {


    const debut =
        document.getElementById(
            "dateDebut"
        ).value;


    const fin =
        document.getElementById(
            "dateFin"
        ).value;


    // ====================================
    // AUCUN FILTRE
    // ====================================

    if (
        !debut &&
        !fin
    ) {

        await afficherVentes(
            commandes
        );

        return;

    }


    // ====================================
    // VÉRIFIER LES DATES
    // ====================================

    if (
        debut &&
        fin &&
        debut > fin
    ) {

        alert(
            "La date de début doit être avant la date de fin."
        );

        return;

    }


    // ====================================
    // FILTRER
    // ====================================

    const resultats =
        commandes.filter(
            commande => {


                // Ignorer les commandes
                // sans date

                if (
                    !commande.date_commande
                ) {

                    return false;

                }


                const date =
                    new Date(
                        commande.date_commande
                    );


                const annee =
                    date.getFullYear();


                const mois =
                    String(
                        date.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    );


                const jour =
                    String(
                        date.getDate()
                    ).padStart(
                        2,
                        "0"
                    );


                const dateCommande =
                    `${annee}-${mois}-${jour}`;


                // Date de début

                if (
                    debut &&
                    dateCommande < debut
                ) {

                    return false;

                }


                // Date de fin

                if (
                    fin &&
                    dateCommande > fin
                ) {

                    return false;

                }


                return true;

            }
        );


    await afficherVentes(
        resultats
    );

}


// ========================================
// AFFICHER TOUTES LES VENTES
// ========================================

async function afficherToutesLesVentes() {


    document.getElementById(
        "dateDebut"
    ).value = "";


    document.getElementById(
        "dateFin"
    ).value = "";


    await afficherVentes(
        commandes
    );

}


// ========================================
// BOUTON RECHERCHER
// ========================================

document
    .getElementById(
        "btnRechercher"
    )
    .addEventListener(
        "click",
        filtrerParPeriode
    );


// ========================================
// BOUTON TOUTES LES VENTES
// ========================================

document
    .getElementById(
        "btnToutes"
    )
    .addEventListener(
        "click",
        afficherToutesLesVentes
    );


// ========================================
// DÉMARRAGE
// ========================================

chargerCommandes();