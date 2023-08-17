//-----------------------------------------------------
// Fonction Asyncrhone pour contacter l'API avec method fetch()
//-----------------------------------------------------

const getData = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const result = await res.json();
      return result;
    } else {
      throw new Error("Erreur traitement  Json");
    }
  } catch (error) {
    console.error("error getData");
    errorMsg();
    return error;
  }
};

//-----------------------------------------------------
// Fonction display 404
//-----------------------------------------------------

function errorMsg() {
  const errorPlaceHolder = document.querySelector("main .limitedWidthBlock");
  errorPlaceHolder.classList.add("error__msg");
  if (window.location.pathname === "/front/index.html") {
    errorPlaceHolder.innerHTML =
      "<p >Une erreur est survenue, veuillez réessayer ulterieurement. </p>";
  } else {
    errorPlaceHolder.innerHTML = `<p >Une erreur est survenue, veuillez réessayer ulterieurement. </p> <a href="./index.html">Retour page d'accueil</a>`;
  }
}

//-----------------------------------------------------
// Fonction message d'alerte quantité max atteinte
//-----------------------------------------------------

function displayAlertMaxColor(color) {
  let UpperCaseColor = color.toUpperCase();
  warningDiv.innerHTML = ` <p> - Quantité maximal atteinte dans le panier pour la couleur : <span>${UpperCaseColor}</span> (100 unités)</p>`;
  warningDiv.classList.remove("item__content__warning--red");
  warningDiv.classList.add("item__content__warning--green");
}

//-----------------------------------------------------
// Fonction message d'alerte quantité absence de selection
//-----------------------------------------------------

function displayAlertNoSelect() {
  warningDiv.innerHTML =
    "<p>veuillez selectionner une quantité et une couleur pour le produit.</p>";
  warningDiv.classList.add("item__content__warning--red");
  warningDiv.classList.remove("item__content__warning--green");
}

//-----------------------------------------------------
// Fonction message d'alerte quantité négative
//-----------------------------------------------------

function displayAlertNegatif() {
  warningDiv.innerHTML =
    "<p >veuillez selectionner une quantité Superieur à 0.</p>";
  warningDiv.classList.add("item__content__warning--red");
  warningDiv.classList.remove("item__content__warning--green");
}
//-----------------------------------------------------
// Fonction message ajout validé
//-----------------------------------------------------

function displayAlertSuccess() {
  successDiv.innerHTML = "<p>Produit ajouté au panier</p>";
  successDiv.classList.remove("item__content__success");
  void successDiv.offsetWidth;
  successDiv.classList.add("item__content__success");
}
//-----------------------------------------------------
// Fonction ajout au localStorage + stringify
//-----------------------------------------------------

const setItemStorage = (add) => {
  localStorage.setItem("products", JSON.stringify(add));
};

//-----------------------------------------------------
// Fonction Calcul prix/quantité total d'article dans le panier
//-----------------------------------------------------

function displayTotal(cart) {
  let prixTotal = cart.reduce((a, b) => b.price * b.quantity + a, 0);
  let itemTotal = cart.reduce((a, b) => b.quantity + a, 0);
  document.getElementById("totalQuantity").innerText = itemTotal;
  document.getElementById("totalPrice").innerText = prixTotal;
  if (itemTotal === 0) {
    document.querySelector("div.cart__price").innerHTML =
      "<p>Votre panier est vide.</p>";
  }
}

//-----------------------------------------------------
// Exportation des  fonctions pour les autres fichiers .JS
export {
  getData,
  setItemStorage,
  displayAlertNoSelect,
  displayAlertMaxColor,
  displayTotal,
  displayAlertNegatif,
  displayAlertSuccess,
  errorMsg,
};
