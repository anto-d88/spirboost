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
// Route pour passer une commande

  router.get('/success', async (req, res) => {
    const userId = parseInt(req.query.userId);

    let { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    
  if (error) {
          return res.status(500).json({ error: error.message });
      }
    res.render('success', { user: users[0]});
  });
  
  router.get('/cancel', (req, res) => {
    res.render('cancel');
  });
  module.exports = router;