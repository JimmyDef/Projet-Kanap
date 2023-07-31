// ---------------------------------------------------------
// Récupération  du N° de commande via l'URL
const pageLocation = window.location.href;

const orderIdUrl = new URL(pageLocation);

const orderId = orderIdUrl.searchParams.get("orderId");

document.getElementById("orderId").innerText = orderId;

// ---------------------------------------------------------
// Nettoyage du local storage
localStorage.clear();
