const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
 
const supabaseURL = "https://gvywdfacvjnnzrsatwdt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXdkZmFjdmpubnpyc2F0d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTA0MDcsImV4cCI6MjAzNTA4NjQwN30.zrOomQ_zeLLV-a6LlxsKYyGaJsocHW2UcK1uY-AbQFg";
const stripe = new Stripe('sk_test_51PSRy2HYRUzu3tRFTSlSejDWnazbH5OEcFl2bGn2yl12Ufm9TJTKgolZWKKQU5nhuWsmRsgUMQ1m9rvdWDPT4LqA00tTNrvGLw');
const supabase = createClient(supabaseURL, supabaseKey);

//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});

// Afficher le panier
router.get('/panier', async (req, res) => {
    const userId = req.query.userId;
    const iduser = Number(userId);
    const { data: cartItems, error: errorcart } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', iduser);

    if (errorcart) {
        return res.status(500).send('Erreur lors de la récupération du panier');
    }
    let { data: users, error: erroruser } = await supabase
    .from('users')
    .select('*')
    .eq('id', iduser)
      
  if (erroruser) {
          return res.status(500).json({ error: error.message });
      }

    res.render('panier', { user: users[0], title: 'Panier', cart: cartItems  });
});

router.post('/panier', async (req, res) => {
    const productId = req.query.id;
    const { quantity, price } = req.body;

    try {
        
        const userId = req.query.userId;
        console.log(userId)
        const { data: existingCartItem } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existingCartItem) {
            // Si l'article existe déjà dans le panier, mettez à jour la quantité et le prix
            const { error: updateError } = await supabase
                .from('cart')
                .update({
                    quantity: existingCartItem.quantity + parseInt(quantity),
                    total_price: (price * existingCartItem.quantity ) + (price * quantity)
                })
                .eq('user_id', userId)
                .eq('product_id', productId);

            if (updateError) {
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du panier' });
            }
        } else {
            // Sinon, ajoutez le produit au panier
            const { error } = await supabase
                .from('cart')
                .insert([{ user_id: userId, product_id: productId, quantity: quantity, total_price: price * quantity}]);

            if (error) {
                return res.status(500).json({ error: 'Erreur lors de l\'ajout au panier' });
            }
        }

        res.status(200).json({ message: 'Produit ajouté au panier' });

    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.post('/delete', async (req, res) => {

    const userId = parseInt(req.query.userId);
    
    try {
        // Supprimer l'article du panier dans la base de données Supabase
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId);

        if (error) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'article', error });
        }

        res.redirect(`/panier?userId=${userId}`);
    } catch (err) {
        res.status(500).json({ message: 'Erreur interne du serveur', err });
    }
       })

// Valider la commande


router.post('/paiement', async (req, res) => {
    const userId = req.query.userId;
    const id = Number(userId);

    try {  const { data: cartItems, error: errorcart } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', id); 
    if (errorcart) {
        return res.status(500).send('Erreur lors de la récupération du panier');
    }
    

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).send('Le panier est vide.');
    }
     


    // (2) Transformer les données pour Stripe
    const lineItems = cartItems.map(item => ({
        price_data: {
            currency: 'eur', // Changez la devise si nécessaire
            product_data: {
                name: "product", // Nom du produit
            },
            unit_amount: item.total_price * 100, // Prix en centimes
        },
        quantity: 1, // Quantité
    })); 
  // (3) Créer une session Stripe Checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    metadata: {
        customer_id: id, // Transmettre l'ID client à Stripe
    },
    success_url: `http://localhost:3000/chargementPaiement?userId=${id}`,
    cancel_url: `http://localhost:3000/panier?userId=${id}`,
});
 

// (4) Rediriger l'utilisateur vers Stripe Checkout
res.redirect(303, session.url);
} 
catch (err) {
console.error('Erreur Stripe:', err);
res.status(500).send('Erreur serveur : Impossible de créer une session Stripe.');
}
});
module.exports = router;
