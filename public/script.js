document.querySelector('.increase').addEventListener('click', () => {
    let quantityInput = document.querySelector('.quantity');;
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
});

document.querySelector('.decrease').addEventListener('click', () => {
    let quantityInput = document.querySelector('.quantity');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = slides.children.length;
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Automatically move to the next slide every 5 seconds
/*setInterval(() => {
    nextSlide();
}, 5000);*/


document.addEventListener('DOMContentLoaded', () => {
    const hidenid = document.getElementById('hidenid').innerHTML;
    const userId = hidenid ;
    document.getElementById("hidenid").style.display = "none"
    const userLinkaccueil = document.getElementById('accueil');
    userLinkaccueil.href = `/accueil?userId=${encodeURIComponent(userId)}`;
    const userLinkpanier = document.getElementById('panier');
    userLinkpanier.href = `/panier?userId=${encodeURIComponent(userId)}`;
    const userLinkpanier2 = document.getElementById('panier2');
    userLinkpanier2.href = `/panier?userId=${encodeURIComponent(userId)}`;
    const userLinkEspaceClient = document.getElementById('espaceClient');
    userLinkEspaceClient.href = `/espaceClient?userId=${encodeURIComponent(userId)}`;

  });
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('.add-to-cart-form');
    
        forms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Empêche le formulaire de se soumettre de manière classique
                const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;
                const productId = form.getAttribute('data-product-id');
                const productPrice = form.getAttribute('data-product-price');
                const quantityInput = form.querySelector('input[name="quantity"]');
                const quantity = quantityInput.value;
                const statusMessage = document.getElementById(`status-${productId}`);
                const btnpanier = document.getElementById(`panier2`);
    
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
    




function placeOrder() {
    fetch('/success', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart })
    })
    .then(response => response.json())
    .then(session => {
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
        if (result.error) {
            alert(result.error.message);
        }
    })
    .catch(error => console.error('Erreur lors de la commande:', error));

 
};



document.addEventListener('DOMContentLoaded', displayCart);

