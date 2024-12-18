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
                  
   


router.get('/contact', async (req, res) => {
  if(!req.query.userId){
    const user = 0;
    res.render('contact', { user: user }); 
  }else{

  const userId = req.query.userId; 
  const id = Number(userId);
console.log(userId)
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
  
    res.render('contact', { user: users[0], products: products }); 
  }
      });
  
    
module.exports = router;