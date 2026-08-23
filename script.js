// -------------------------
// Produits
// -------------------------

let products = [];


// -------------------------
// Panier
// -------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------------
// charger les produits
// -------------------------
async function loadProducts() {

    try {

        const response = await fetch(
            "/api/produits"
        );

        if (!response.ok) {
            throw new Error("Erreur serveur");
        }

        products = await response.json();

        console.log("Produits récupérés :", products);

        displayProducts();
        updateCart();

    } catch (error) {

        console.error("Erreur :", error);

        document.getElementById("products").innerHTML = `
            <p>Impossible de récupérer les produits.</p>
        `;
    }
}
// -------------------------
// Afficher les produits
// -------------------------

function displayProducts(list = products) {

    const container = document.getElementById("products");

    container.innerHTML = "";

    list.forEach(product => {

        const div = document.createElement("div");

        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.nom}">

            <h3>${product.nom}</h3>

            <div class="price">
                ${Number(product.prix).toLocaleString()} DA
            </div>

            <button class="add"
                onclick="event.stopPropagation();
                         addToCart(${product.id})">
                Ajouter au panier
            </button>
        `;

        div.addEventListener("click", () => {
            window.location.href =
            `product.html?id=${product.id}`;
        });

        container.appendChild(div);
    }); 
      
                
}

// afficher produit

function showProductDetails(id) {

    const product = products.find(
        p => Number(p.id) === Number(id)
    );

    if (!product) return;

    document.getElementById("productDetails").innerHTML = `

        <div class="detailsContent">

            <button
                class="closeDetails"
                onclick="closeProductDetails()">
                ✕
            </button>

            <img
                src="${product.image}"
                alt="${product.nom}">

            <h2>${product.nom}</h2>

            <p class="detailsPrice">
                ${Number(product.prix).toLocaleString()} DA
            </p>

            <p>
                ${product.description}
            </p>

            <p>
                <strong>Stock :</strong>
                ${product.stock}
            </p>

            <button
                class="add detailsButton"
                onclick="addToCart(${product.id});
                         closeProductDetails()">

                Ajouter au panier

            </button>

        </div>
    `;

    document.getElementById(
        "productDetails"
    ).style.display = "block";
}

function closeProductDetails() {

    document.getElementById("productDetails").style.display = "none";
}


// -------------------------
// Ajouter au panier
// -------------------------

function addToCart(id) {
   let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
        item => Number(item.id) === Number(id)
    );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: Number(id),
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart)
    );

    updateCart();

    alert("Produit ajouté au panier !");

}

// -------------------------
// Sauvegarder le panier
// -------------------------

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// -------------------------
// Afficher le panier
// -------------------------

function updateCart() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {

        total += Number(item.quantity) || 0;

    });

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = total;

    }
    
    const cartButton = document.getElementById("cartButton");

        if (total > 0) {
            cartButton.classList.add("cart-active");
        } else {
            cartButton.classList.remove("cart-active");
        }

        
}


// -------------------------
// Augmenter quantité
// -------------------------

function increase(id) {

    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity++;
    }

    saveCart();
    updateCart();
}


// -------------------------
// Diminuer quantité
// -------------------------

function decrease(id) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    updateCart();
}


// -------------------------
// Supprimer
// -------------------------

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCart();
}


// -------------------------
// Recherche
// -------------------------

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const text = this.value.toLowerCase();

        const result = products.filter(product =>
            product.nom.toLowerCase().includes(text)
        );

        displayProducts(result);
    });


// -------------------------
// Fermer panier
// -------------------------

document
    .getElementById("closeCart")
    .addEventListener("click", function () {

        document.getElementById("cartModal").style.display = "none";
    });


// -------------------------
// Commander
// -------------------------

document
    .getElementById("checkout")
    .addEventListener("click", function () {

        if (cart.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        alert("Commande enregistrée !");

        cart = [];

        saveCart();
        updateCart();
    });


// -------------------------
// Initialisation
// -------------------------

loadProducts();
