import { errorMsg, getData } from "./utils.module.js";

//-----------------------------------------------------
// Contacte l'API via fonction getData
//-----------------------------------------------------
getData("https://jimmydef.net/api/products")
  .then((value) => {
    value.map((kanap) => displayKanap(kanap));
  })

  // Gestion des erreurs avec la création d'un message pour l'utilisateur
  .catch(function (err) {
    console.log("erreur chargement liste des produits:", err);

    errorMsg();
  });

//-----------------------------------------------------
// Fonction  création des cards / liens des produits détaillés
//-----------------------------------------------------

const displayKanap = (modelKanap) => {
  const target = document.getElementById("items");
  const link = document.createElement("a");
  link.href = `./product.html?id=${modelKanap._id}`;
  link.innerHTML = `<article>
            <img src="${modelKanap.imageUrl}" alt="${modelKanap.altTxt}">
            <h3 class="productName">${modelKanap.name}</h3>
            <p class="productDescription">${modelKanap.description}</p>
            </article>`;
  target.append(link);
};
