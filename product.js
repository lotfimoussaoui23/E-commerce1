const params = new URLSearchParams(
    window.location.search
);

const productId = params.get("id");

let selectedQuantity = 1;
let currentStock = 0;

async function loadProduct() {

    try {

        const response =
            await fetch("/api/produits");

        const products =
            await response.json();

        const product = products.find(
            p => Number(p.id) === Number(productId)
        );

        if (!product) {

            document.getElementById("productPage").innerHTML =
                "<h2>Produit introuvable</h2>";

            return;
        }

        displayProduct(product);

    }
    catch (error) {

        console.error(error);

        document.getElementById("productPage").innerHTML =
            "<h2>Erreur de chargement</h2>";
    }
}


function displayProduct(product) {

    selectedQuantity = 1;
    currentStock = Number(product.stock) || 0;

    document.getElementById("productPage").innerHTML = `

        <div class="productDetailPage">


            <!-- IMAGE -->

            <div class="productDetailImage">

                <img
                    src="${product.image}"
                    alt="${product.nom}"
                >

            </div>


            <!-- INFORMATIONS -->

            <div class="productDetailInfo">

                <h1>
                    ${product.nom}
                </h1>


                <p class="productSeller">

                    Vendu par :
                    <span>Votre boutique</span>

                </p>


                <div class="productBreadcrumb">

                    ACCUEIL
                    <span>›</span>

                    PRODUITS
                    <span>›</span>

                    ${product.nom}

                </div>


                <!-- QUANTITÉ -->

<div class="quantity-selector">

    <button type="button" onclick="changeQuantity(-1)">
        −
    </button>

    <span id="quantity">1</span>

    <button type="button" onclick="changeQuantity(1)">
        +
    </button>

</div>

<button
    class="productAddButton"
    onclick="addProductToCart(${product.id})">

    AJOUTER AU PANIER

</button>

                <div class="productDetailPrice">

                    ${Number(product.prix).toLocaleString()} DA

                </div>


                <div class="productDescription">

                    <h2>Description</h2>

                    <p>
                        ${product.description}
                    </p>

                </div>


                <div class="productStock">

                    Stock disponible :
                    <strong>${product.stock}</strong>

                </div>


            </div>

        </div>

    `;
    

    
    // 🔍 ZOOM DE L'IMAGE

    const box = document.querySelector(".productDetailImage");
    const img = box.querySelector("img");

    box.addEventListener("mousemove", (e) => {

        const rect = box.getBoundingClientRect();

        const x =
            ((e.clientX - rect.left) / rect.width) * 100;

        const y =
            ((e.clientY - rect.top) / rect.height) * 100;

        img.style.transformOrigin = `${x}% ${y}%`;

        img.style.transform = "scale(1.8)";
    });


    box.addEventListener("mouseleave", () => {

        img.style.transform = "scale(1)";

        img.style.transformOrigin = "center";
    });

}

function changeQuantity(change) {

    selectedQuantity += change;

    if (selectedQuantity < 1) {
        selectedQuantity = 1;
    }

    if (
        currentStock > 0 &&
        selectedQuantity > currentStock
    ) {
        selectedQuantity = currentStock;
    }

    const quantityElement =
        document.getElementById("quantity");

    if (quantityElement) {
        quantityElement.textContent =
            selectedQuantity;
    }
}

function addProductToCart(id) {

    /*
       On utilise la fonction addToCart()
       déjà présente dans script.js
    */
    if (currentStock <= 0) {

        alert("Ce produit est en rupture de stock.");

        return;
    }

    addToCart(id, selectedQuantity);

}


function goBack() {

    window.location.href = "index.html";

}



loadProduct();
