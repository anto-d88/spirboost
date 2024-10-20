const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
  
   
const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
const app = express();   
const port = 3000;
// Route de base 
const historyRoutes = require('./routes/historys');
const authRoutes = require('./routes/auth');             
const productRoutes = require('./routes/product');
const accueilRoutes = require('./routes/accuei');
const commandeRoutes = require('./routes/commande');
const panierRoutes = require('./routes/panier'); 
const espaceClientRoutes = require('./routes/espaceClient'); 
// Middleware pour parser les requêtes POST          
app.use(express.urlencoded({ extended: true }));
app.use(express.json());    
// configuration connection postGreSQL
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey);
//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});
                              
// Middleware pour servir des fichiers statiques
    
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

                                   
// Route Aboute
app.use(accueilRoutes);
app.use(historyRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(commandeRoutes);
app.use(panierRoutes);
app.use(espaceClientRoutes);
           

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
