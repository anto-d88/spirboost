const express = require('express');
const router = express.Router();
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
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
    console.log(productId);
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
router.post('/success', async (req, res) => {

    try{
    const userId = parseInt(req.query.userId);
    
    const { data: cartItems, error: cartItemserror } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId);

       

    if (cartItemserror) {
        return res.status(500).json({ cartItemserror });
    }
    console.log(cartItems)


    const productid = cartItems[0].product_id

    const { data: product, error: errorproduct } = await supabase
    .from('products')
    .select('*')
    .eq('id', productid);

    if (errorproduct) {
        return res.status(500).json({ errorproduct });
    }
    console.log(product)
    const { data: user, error: erroruser } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId);

    if (erroruser) {
        return res.status(500).json({ erroruser });
    }
    console.log(user)
    if (cartItems.length > 0) {


        const { error: orderError } = await supabase
            .from('orders')
            .insert([{  client_id: cartItems[0].user_id, product: product[0].name,  quantity: cartItems[0].quantity, amount_euros: cartItems[0].total_price, order_status: "validée", email: user[0].email }]);

        if (orderError) {
            return res.status(500).json({ orderError });
        }

        // Vider le panier après la commande
        await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId);

       // res.render('order-confirmation', { title: 'Confirmation de commande' });
        res.redirect(`/success?userId=${userId}`);
    } else {
        res.redirect(`/accueil?userId=${userId}`);
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors des requêtes sur la base de données' });
}
});

module.exports = router;
