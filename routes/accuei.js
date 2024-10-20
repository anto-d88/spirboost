const express = require('express');

const path = require('path');
const router = express.Router();

const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey);

//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});

const authenticate = (req, res, next) => {
  if (!req.query.userId) {
    return res.redirect('/login');
  }
  next();
};


router.get('/', async (req, res) => {
  const user = 0;
  const { data: products, error2 } = await supabase
  .from('products')
  .select('*')
  .eq('id', 1)
if (error2) throw error2;


  res.render('accueil', { user: user, products: products }); 
      });

router.get('/accueil', authenticate, async (req, res) => {
  const userId = req.query.userId;
  const id = Number(userId);
 


  let { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', id)
  
if (error) {
        return res.status(500).json({ error: error.message });
    }
    console.log(users[0])
    
    const { data: products, error2 } = await supabase
  .from('products')
  .select('*')
  .eq('id', 1);
if (error2) throw error2;
console.log(products)
  
    res.render('accueil', { user: users[0], products: products }); 
      });
  //});



module.exports = router;