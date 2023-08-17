import { getData, setItemStorage, displayTotal } from "./utils.module.js";

//-----------------------------------------------------
// Fonction  vérification du panier pour affichage du formulaire de commande
//-----------------------------------------------------

const emptyCart = () => {
  const cart = JSON.parse(localStorage.getItem("products"));

  if (cart === null || cart.length === 0) {
    document.querySelector("div.cart__price").innerHTML =
      "<p>Votre panier est vide.</p>";
    const form = document.querySelector(".cart__order");
    form.innerHTML = "";
    return true;
  }
};

//-----------------------------------------------------
// Trie du panier pour regrouper les produits par ID
//-----------------------------------------------------

const haveNoProduct = emptyCart();

if (!haveNoProduct) {
  const cart = JSON.parse(localStorage.getItem("products"));

  const myCartSorted = cart.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    }
    if (a.id < b.id) {
      return -1;
    }
  });

  //-----------------------------------------------------
  // Ajout d'une pair clé/valeur 'order' pour le tri CSS /flexbox
  //-----------------------------------------------------

  let myCartWithOrder = myCartSorted.map((element, idx) => {
    return { ...element, order: idx };
  });

  //-----------------------------------------------------
  // Création d'un tableau accueillant les prix des produits
  //
  let productsPriceArray = [];

  //-----------------------------------------------------
  // Boucle itérant sur le panier
  //-----------------------------------------------------

  for (let item of myCartWithOrder) {
    //-----------------------------------------------------
    // Récupération id / couleur produit unique
    const [productId, selectedColor] = item.id.split("-");

    //
    //-----------------------------------------------------
    // Appel de l'API pour chaque canapé
    //
    getData(`https://kanap.jimmydef.net/api/products/${productId}`)
      .then((kanap) => {
        //-----------------------------------------------------
        // Création détails produit
        //

        const article = document.createElement("article");
        article.className = "cart__item";
        article.style.order = `${item.order}`;
        article.dataset.id = productId;
        article.dataset.color = selectedColor;
        article.innerHTML = `
            <div class="cart__item__img" >
              <img src="${kanap.imageUrl}" alt="${kanap.altTxt}" />
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${kanap.name}</h2>
                <p>${selectedColor}</p>
                <p>${kanap.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté :</p>
                  <input
                    type="number"
                    class="itemQuantity"
                    name="itemQuantity"
                    min="1"
                    max="100"
                    value="${item.quantity}"
                  />
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
        `;
        document.getElementById("cart__items").appendChild(article);

        //-----------------------------------------------------
        // Ajout des prix au tableau
        //
        productsPriceArray.push({
          id: `${productId}-${selectedColor}`,
          price: kanap.price,
          quantity: item.quantity,
        });

        //  -------------------------------------------------------
        // Déclanchement du calcul total Quantité / Prix à la fin des itérations
        //
        if (myCartWithOrder.length === productsPriceArray.length) {
          displayTotal(productsPriceArray);
        }

        //-----------------------------------------------------
        // Ecoute et mise à jour des quantitées du panier
        //-----------------------------------------------------

        const targetId = document.querySelector(
          `[data-id="${productId}"][data-color="${selectedColor}"] `
        );

        targetId.addEventListener("change", function (e) {
          //-----------------------------------------------------
          // recherche de l'objet contenant le prix et la quantité
          //
          let foundItem = productsPriceArray.find(
            (product) => product.id === `${productId}-${selectedColor}`
          );

          // ----------------------
          myCartWithOrder.map((product) => {
            delete product.order;
            return product;
          });
          //-----------------------------------------------------
          // Mise à jour des Totaux et du local storage en fonction des quantités
          //

          if (
            parseInt(e.target.value) == 0 ||
            e.target.value < 0 ||
            e.target.value == ""
          ) {
            deleteAProduct();
            return;
          }
          if (e.target.value >= 100) {
            foundItem.quantity = 100;
            e.target.value = 100;
            item.quantity = 100;
            displayTotal(productsPriceArray);
            setItemStorage(myCartWithOrder);
            return;
          }

          foundItem.quantity = parseInt(e.target.value);

          item.quantity = parseInt(e.target.value);
          e.target.value = parseInt(e.target.value);
          displayTotal(productsPriceArray);
          setItemStorage(myCartWithOrder);
        });

        //-----------------------------------------------------
        //-----------------------------------------------------

        const deleteBtn = document.querySelector(
          `[data-id="${productId}"][data-color="${selectedColor}"] .cart__item__content__settings__delete`
        );

        //-----------------------------------------------------
        // fonction suppression de l'article et mise à jour Totaux / local Storage / panier
        //-----------------------------------------------------

        const deleteAProduct = () => {
          deleteBtn.closest("article").remove();
          myCartWithOrder.map((product) => {
            delete product.order;
            return product;
          });
          productsPriceArray = productsPriceArray.filter(
            (product) => product.id !== `${productId}-${selectedColor}`
          );
          displayTotal(productsPriceArray);
          myCartWithOrder = myCartWithOrder.filter(
            (product) => product !== item
          );

          setItemStorage(myCartWithOrder);

          emptyCart();
        };
        deleteBtn.addEventListener("click", deleteAProduct);
      })

      // --------------------------------------------
      // Génération du message en cas d'erreur
      //-----------------------------------------------------
      .catch(function (error) {
        console.log("erreur PANIER:", error);
      });
  }

  //-----------------------------------------------------
  // Const où afficher les msg en cas d'erreur
  //-----------------------------------------------------

  const form = document.querySelector(".cart__order__form");
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  //-----------------------------------------------------
  // RegExp selon le type de données à vérifier
  //-----------------------------------------------------

  const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  const regExNomPrenomVille = new RegExp(/^[a-z ,.'-]+$/i);
  const regExAdresse = new RegExp(/^[a-z0-9 ,.'-]+$/i);

  //-----------------------------------------------------
  // Fonctions  pour les test de  regEx
  //-----------------------------------------------------

  const emailTRegTest = (value) => emailReg.test(value);
  const nomPrenomVilleRegTest = (value) => regExNomPrenomVille.test(value);
  const adresseTRegTest = (value) => regExAdresse.test(value);

  //-----------------------------------------------------
  // Fonctions de validation des champs formulaire
  //-----------------------------------------------------

  function firstNameTest() {
    if (nomPrenomVilleRegTest(form.firstName.value)) {
      firstNameErrorMsg.innerText = "";
      return true;
    }
    firstNameErrorMsg.innerText = "Prénom incorrect";
  }

  function lastNameTest() {
    if (nomPrenomVilleRegTest(form.lastName.value)) {
      lastNameErrorMsg.innerText = "";
      return true;
    } else {
      lastNameErrorMsg.innerText = " Nom incorrect";
    }
  }

  function addressTest() {
    if (adresseTRegTest(form.address.value)) {
      addressErrorMsg.innerText = "";
      return true;
    } else {
      addressErrorMsg.innerText = " Adresse incorrecte";
    }
  }

  function cityTest() {
    if (nomPrenomVilleRegTest(form.city.value)) {
      cityErrorMsg.innerText = "";
      return true;
    } else {
      cityErrorMsg.innerText = " Ville  incorrecte";
    }
  }

  function emailTest() {
    if (emailTRegTest(form.email.value)) {
      emailErrorMsg.innerText = "";
      return true;
    } else {
      emailErrorMsg.innerText = "Email incorrect";
    }
  }

  //-----------------------------------------------------
  // Ecoute des champs de saisie du formulaire individuel
  //-----------------------------------------------------

  form.firstName.addEventListener("change", function (e) {
    firstNameTest();
  });

  form.lastName.addEventListener("change", function (e) {
    lastNameTest();
  });
  form.address.addEventListener("change", function (e) {
    addressTest();
  });
  form.city.addEventListener("change", function (e) {
    cityTest();
  });

  form.email.addEventListener("change", function (e) {
    emailTest();
  });

  //-----------------------------------------------------
  // Ecoute bouton "Commander"
  //-----------------------------------------------------

  const submitBtn = document.getElementById("order");
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    firstNameTest();
    lastNameTest();
    addressTest();
    cityTest();
    emailTest();

    //-----------------------------------------------------
    //  Vérification  tous les champs sont valide (passent à TRUE )
    //
    if (
      firstNameTest() &&
      lastNameTest() &&
      addressTest() &&
      cityTest() &&
      emailTest()
    ) {
      //-----------------------------------------------------
      // Création des infos pour le BODY du fetch avec la method POST
      //
      const contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,
      };

      let products = myCartWithOrder.map((product) => {
        const [productId] = product.id.split("-");
        return productId;
      });

      const purchaseOrder = { contact, products };

      //-----------------------------------------------------
      // Envoie contact et produit selectionné à l'API
      //-----------------------------------------------------

      fetch("https://kanap.jimmydef.net/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseOrder),
      })
        .then((response) => response.json())
        .then((data) => {
          //-----------------------------------------------------
          // Redirection vers la page de confirmation avec orderId dans l'url
          //
          window.location.href = `./confirmation.html?orderId=${data.orderId}`;
        })
        .catch((error) => console.log("error fetch POST", error));
    }
  });
}
