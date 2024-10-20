document.querySelector('.informations').addEventListener('click', () => {
    let informations = document.querySelector('.boxInfoClient');;
    informations.style.display = "block"
    let commandes = document.querySelector('.boxCommandes');;
    commandes.style.display = "none"

});
document.querySelector('.commandes').addEventListener('click', () => {
    let informations = document.querySelector('.boxInfoClient');;
    informations.style.display = "none"
    let commandes = document.querySelector('.boxCommandes');;
    commandes.style.display = "block"

});