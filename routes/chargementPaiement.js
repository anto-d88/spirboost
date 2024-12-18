const express = require('express');
const router = express.Router();
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const supabaseURL = "https://gvywdfacvjnnzrsatwdt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXdkZmFjdmpubnpyc2F0d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTA0MDcsImV4cCI6MjAzNTA4NjQwN30.zrOomQ_zeLLV-a6LlxsKYyGaJsocHW2UcK1uY-AbQFg";

const supabase = createClient(supabaseURL, supabaseKey);

//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});

router.get('/chargementPaiement', (req, res) => {
    const userId = req.query.userId;
    res.render('chargementPaiement', { userId: userId });
});
router.get('/api/chargementPaiement', async (req, res) => {
    try {
        const userId = req.query.userId;
        const id = Number(userId);

        console.log(id, "OK");

        // Récupération du panier
        const { data: cartItems, error: cartItemserror } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', id);

        if (cartItemserror) {
            return res.status(500).json({ error: cartItemserror });
        }

        const product_id = cartItems[0]?.product_id;

        // Récupération du produit
        const { data: product, error: errorproduct } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id);

        if (errorproduct) {
            return res.status(500).json({ error: errorproduct });
        }

        // Récupération de l'utilisateur
        const { data: user, error: erroruser } = await supabase
            .from('users')
            .select('*')
            .eq('id', id);

        if (erroruser) {
            return res.status(500).json({ error: erroruser });
        }

        // Création de la commande
        const { error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    client_id: user[0].id,
                    product: product[0].name,
                    quantity: cartItems[0].quantity,
                    amount_euros: cartItems[0].total_price,
                    order_status: 'validée',
                    email: user[0].email,
                },
            ]);

        if (orderError) {
            return res.status(500).json({ error: orderError });
        }

        // Vider le panier
        await supabase
            .from('cart')
            .delete()
            .eq('user_id', id);

        // Retourner les données pour la redirection
        res.json({ success: true, user: user[0] });
    } catch (error) {
        console.error('Erreur lors du traitement :', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router; 