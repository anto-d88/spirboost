const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;
document.getElementById("hidenid").style.display = "none"

async function processOrder() { 
  try {
    const response = await fetch(`/api/chargementPaiement?userId=${userId}`);
    const result = await response.json();

    if (result.success) {
      window.location.href = `/success?userId=${encodeURIComponent(userId)}`;
    } else {
      alert('Erreur : ' + result.error);
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    alert('Impossible de communiquer avec le serveur.');
  }
}

// Simuler une attente de chargement avant de lancer la requête
setTimeout(processOrder, 2000);