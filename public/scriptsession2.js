
const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;
document.getElementById("hidenid").style.display = "none"

document.addEventListener('DOMContentLoaded', () => {
  const userLinkaccueil = document.getElementById('accueil');
  userLinkaccueil.href = `/accueil?userId=${encodeURIComponent(userId)}`;
  const userLinkpanier = document.getElementById('panier');
  userLinkpanier.href = `/panier?userId=${encodeURIComponent(userId)}`;
  const userLinkpanier2 = document.getElementById('panier2');
  userLinkpanier2.href = `/panier?userId=${encodeURIComponent(userId)}`;
  const userLinkspiruline = document.getElementById('spirulineBio');
  userLinkspiruline.href = `/spirulineBio?userId=${encodeURIComponent(userId)}`;
  const userLinkEspaceClient = document.getElementById('espaceClient');
userLinkEspaceClient.href = `/espaceClient?userId=${encodeURIComponent(userId)}`;
const userLinkhistoirespiruline = document.getElementById('histoiredelaspiruline');
userLinkhistoirespiruline.href = `/histoiredelaspiruline?userId=${encodeURIComponent(userId)}`;
const userLinkcontact = document.getElementById('contact');
userLinkcontact.href = `/contact?userId=${encodeURIComponent(userId)}`;

});
document.addEventListener('DOMContentLoaded', () => {

     // Sélectionnez tous les formulaires avec la classe 'add-to-cart-form'
     const forms = document.querySelectorAll('.add-to-cart-form');

     // Parcourez chaque formulaire pour ajouter un gestionnaire d'événement 'submit'

     
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le formulaire de se soumettre de manière classique
 
            const productId = form.getAttribute('data-product-id');
            const productPrice = form.getAttribute('data-product-price');
            const quantityInput = form.querySelector('input[name="quantity"]');
            const quantity = quantityInput.value;
            const statusMessage = document.getElementById(`status-${productId}`);
            const btnpanier = document.getElementById(`panier2`);
 console.log("response")
            
            try {
                const response = await fetch(`/panier?userId=${encodeURIComponent(userId)}&id=${encodeURIComponent(productId)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${localStorage.getItem('token')}` // Inclure le token d'authentification si nécessaire
                    },
                    body: JSON.stringify({ quantity, price: productPrice })
                });

                if (!response.ok) throw new Error('Erreur lors de l\'ajout au panier');

                statusMessage.textContent = 'Produit ajouté au panier!';
                statusMessage.style.color = 'green';
                btnpanier.style.display = "block";

                // Optionnel : Vous pouvez mettre à jour la vue du panier ici

            } catch (error) {
                statusMessage.textContent = 'Échec de l\'ajout au panier.';
                statusMessage.style.color = 'red';
            }
        });
    });
});


// Sélectionner l'élément checkbox et body
const menuToggle = document.getElementById('menu-toggle');
const body = document.body;

// Ajouter un écouteur d'événements pour modifier la classe "no-scroll" sur le body
menuToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('no-scroll'); // Empêche le défilement
    } else {
        body.classList.remove('no-scroll'); // Réactive le défilement
    }
});


