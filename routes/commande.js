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