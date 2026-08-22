let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let products = [];


// ============================
// CHARGER LES PRODUITS
// ============================

async function loadProducts() {

    try {

        const response = await fetch("/api/produits");

        if (!response.ok) {
            throw new Error("Erreur API : " + response.status);
        }

        products = await response.json();

        console.log("Produits récupérés :", products);
        console.log("Panier :", cart);

        displayCart();

    } catch (error) {

        console.error("Erreur :", error);

    }

}


// ============================
// AFFICHER LE PANIER
// ============================

function displayCart() {

    const container =
        document.getElementById("cartItems");

    container.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );


        if (!product) {

            console.error(
                "Produit introuvable avec ID :",
                item.id
            );

            return;
        }


        // Accepte "name" ou "nom"
        const name =
            product.name ?? product.nom ?? "Produit";


        // Accepte "price" ou "prix"
        const price =
            Number(product.price ?? product.prix) || 0;


        const quantity =
            Number(item.quantity) || 1;


        const productTotal =
            price * quantity;


        total += productTotal;


        const div =
            document.createElement("div");

        div.className = "cartItem";


        div.innerHTML = `

            <div class="cartImage">
               <img src="${product.image}" alt="${name}">
            </div>

            <div class="cartProduct">
                <h3> ${name} </h3>
            </div>


            <div class="cartPrice">
                ${price.toLocaleString()} DA
            </div>


            <div class="cartQuantity">

                <button
                    onclick="changeQuantity(${item.id}, -1)">
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

            </div>


            <div class="cartProductTotal">

                ${productTotal.toLocaleString()} DA

            </div>


            <button
                class="deleteProduct"
                onclick="removeProduct(${item.id})">

                🗑️

            </button>

        `;


        container.appendChild(div);

    });


    document.getElementById("cartTotal").textContent =
        total.toLocaleString() + " DA";

}


// ============================
// QUANTITÉ
// ============================

function changeQuantity(id, change) {

    const item = cart.find(
        item => Number(item.id) === Number(id)
    );

    if (!item) return;


    item.quantity =
        Number(item.quantity) + change;


    if (item.quantity <= 0) {

        cart = cart.filter(
            item => Number(item.id) !== Number(id)
        );

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}


// ============================
// SUPPRIMER
// ============================

function removeProduct(id) {

    cart = cart.filter(
        item => Number(item.id) !== Number(id)
    );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}


// ============================
// DÉMARRAGE
// ============================

loadProducts();


// ========================================
// VALIDER LA COMMANDE
// ========================================

const orderForm = document.getElementById("orderForm");

if (orderForm) {

    orderForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        // Récupérer le panier
        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];


        if (cart.length === 0) {

            alert("Votre panier est vide !");
            return;

        }


        // Récupérer les informations du client
        const client = {

            prenom:
                document.getElementById("prenom").value.trim(),

            nom:
                document.getElementById("nom").value.trim(),

            wilaya:
                document.getElementById("wilaya").value,

            ville:
                document.getElementById("ville").value.trim(),

            adresse:
                document.getElementById("adresse").value.trim(),

            codePostal:
                document.getElementById("codePostal").value.trim(),

            telephone:
                document.getElementById("telephone").value.trim(),

            email:
                document.getElementById("email").value.trim(),

            notes:
                document.getElementById("notes").value.trim()

        };


        try {

            const response = await fetch(
                "/api/commandes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        client: client,

                        produits: cart

                    })

                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Erreur lors de l'enregistrement"
                );

            }


            // ========================================
            // COMMANDE ENREGISTRÉE
            // ========================================

            alert(
                "Commande enregistrée avec succès !\n\n" +
                "Numéro de commande : " +
                result.commandeId +
                "\n" +
                "Total : " +
                Number(result.total).toLocaleString() +
                " DA"
            );


            // Vider le panier
            localStorage.removeItem("cart");


            // Retour à l'accueil
            window.location.href = "index.html";


        } catch (error) {

            console.error(
                "Erreur commande :",
                error
            );


            alert(
                "Impossible d'enregistrer la commande.\n\n" +
                error.message
            );

        }

    });

}