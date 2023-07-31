import {
  getData,
  setItemStorage,
  displayAlertNoSelect,
  displayAlertMaxColor,
  displayAlertNegatif,
  displayAlertSuccess,
} from "./utils.module.js";

// ---------------------------------------------------------
// Récupération  de l'id du produit via l'URL

const urlProduct = new URL(window.location.href);
const productId = urlProduct.searchParams.get("id");

//-----------------------------------------------------
// Récuperation API et création de la fiche  produit
//-----------------------------------------------------

getData(`https://jimmydef.net/api/products/${productId}`)
  .then((kanap) => {
    document.getElementById("title").innerText = kanap.name;
    document.getElementById("price").innerText = kanap.price;
    document.getElementById("description").innerText = kanap.description;
    const targetImg = document.querySelector(".item__img");
    const image = document.createElement("img");
    image.src = kanap.imageUrl;
    targetImg.appendChild(image);

    //-----------------------------------------------------
    // Création des options pour la selection des couleurs
    //-----------------------------------------------------

    for (let i of kanap.colors) {
      const targetSelect = document.getElementById("colors");
      const option = document.createElement("option");
      targetSelect.appendChild(option).innerText = i;
      option.setAttribute("value", i);
    }
  })

  //-----------------------------------------------------
  // Gestion des erreurs et création  message l'utilisateur
  //-----------------------------------------------------

  .catch(function (err) {
    console.log("erreur chargement fiche produit:", err);
    errorMsg(msg404WithLink);
  });

//-----------------------------------------------------

const selectColor = document.querySelector("#colors");
const selectQuantity = document.querySelector("#quantity");

const myForm = document.querySelector("#myForm");
const cart = [];
const warningDiv = document.getElementById("warningDiv");
const successDiv = document.getElementById("successDiv");

//-----------------------------------------------------
// Ecoute bouton "ajouter au panier"
//-----------------------------------------------------

document.querySelector("#addToCart").addEventListener("click", function (e) {
  e.preventDefault();

  //-----------------------------------------------------
  // Création de l'objet pour le panier
  //-----------------------------------------------------

  let productDetails = {
    id: `${productId}-${selectColor.value}`,
    quantity: parseInt(selectQuantity.value),
  };

  //-----------------------------------------------------
  // Vérification selection couleur/quantité
  //-----------------------------------------------------

  if (
    selectQuantity.value === "0" ||
    selectColor.value === "" ||
    selectQuantity.value === ""
  ) {
    displayAlertNoSelect();
  } else if (parseInt(selectQuantity.value) <= 0) {
    displayAlertNegatif();
  } else {
    warningDiv.innerHTML = "";

    if (selectQuantity.value >= 100) {
      productDetails.quantity = 100;

      displayAlertMaxColor(selectColor.value);
    }

    //
    //-----------------------------------------------------
    // Gestion du local storage
    //-----------------------------------------------------
    //

    cart.push(productDetails);

    // verification si localStorage existe :::
    // NON: Création du localStorage
    if (localStorage.getItem("products") === null) {
      setItemStorage(cart);
      displayAlertSuccess();

      myForm.reset();
      return;
    }

    //-----------------------------------------------------
    // OUI : Récupération du local storage + parse

    const currentCart = JSON.parse(localStorage.getItem("products"));

    //-----------------------------------------------------
    // verifie si le produit existe déja dans le panier
    //-----------------------------------------------------

    let productToUpdate = currentCart.find(
      (product) => product.id === `${productId}-${selectColor.value}`
    );

    //-----------------------------------------------------
    // NON : Produit inexistant, ajout de l'objet au panier

    if (productToUpdate === undefined) {
      currentCart.push(productDetails);
      setItemStorage(currentCart);
      displayAlertSuccess();
      myForm.reset();
      return;
    }
    //-----------------------------------------------------
    // OUI : Produit existant, mise à jour des quantités et du panier

    productToUpdate.quantity =
      parseInt(selectQuantity.value) + parseInt(productToUpdate.quantity);
    if (productToUpdate.quantity >= 100) {
      productToUpdate.quantity = 100;
      displayAlertMaxColor(productToUpdate.id.split("-")[1]);
    }
    if (productToUpdate.quantity < 100) {
      displayAlertSuccess();
    }

    //-----------------------------------------------------
    // Fonction pour remplacer l'objet avec la quantité mise à jour
    //-----------------------------------------------------

    const cartUpdated = currentCart.filter(
      (product) => product.id !== productToUpdate.id
    );
    cartUpdated.push(productToUpdate);

    setItemStorage(cartUpdated);

    //-----------------------------------------------------
    // retour à l'état initial des champs de selections
    //-----------------------------------------------------
    myForm.reset();
  }
});
