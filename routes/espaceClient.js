const express = require('express');

const path = require('path');
const router = express.Router();

const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const supabaseURL = "https://gvywdfacvjnnzrsatwdt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXdkZmFjdmpubnpyc2F0d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTA0MDcsImV4cCI6MjAzNTA4NjQwN30.zrOomQ_zeLLV-a6LlxsKYyGaJsocHW2UcK1uY-AbQFg";
const supabase = createClient(supabaseURL, supabaseKey);

//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});

const authenticate = (req, res, next) => {
  if (!req.query.userId) {
    return res.redirect('/login');
  }
  next();
};


router.get('/espaceClient', authenticate, async (req, res) => {
  const userId = req.query.userId;
  const id = Number(userId);
 


  try { let { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', id)
  
if (error) {
        return res.status(500).json({ error: error.message });
    }
    const { data: ordersItems, error2: errorcart } = await supabase
    .from('orders')
    .select('*')
    .eq('client_id', id); 
console.log(ordersItems) 

if (errorcart) {
    return res.status(500).send('Erreur lors de la récupération du panier');
}


  
    res.render('espaceClient', { user: users[0], ordersItems }); 
}
    catch (err) {
      console.error('Erreur Stripe:', err);
      res.status(500).send('Erreur serveur : Impossible de créer une session Stripe.');
      }
      });
  //});



module.exports = router;