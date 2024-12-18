const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); // Importez cookie-parser
const csrf = require('csurf');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const csrfProtection = csrf({ cookie: true }); // Utilisation des cookies pour stocker le token CSRF

// Charger les variables d'environnement
dotenv.config(); // Charge les variables d'environnement depuis .env

// Initialiser l'application Express
const app = express();   
const port = 3000;

// Charger les routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product'); 
const accueilRoutes = require('./routes/accuei');
const contactRoutes = require('./routes/contact');
const spirulineBioRoutes = require('./routes/spirulineBio');
const commandeRoutes = require('./routes/commande'); 
const panierRoutes = require('./routes/panier'); 
const espaceClientRoutes = require('./routes/espaceClient'); 
const histoireRoutes = require('./routes/histoiredelaspiruline');  
const successRoutes = require('./routes/success'); 
const chargementPaiementRoutes = require('./routes/chargementPaiement');

// Configuration de Supabase via les variables d'environnement
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// Configurez cookie-parser avant csrfProtection
app.use(cookieParser());
// Middleware pour parser les requêtes POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sécurisation des en-têtes HTTP avec Helmet
app.use(helmet());

// Middleware CSRF
//app.use(csrfProtection);

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Utilisation des routes
app.use(histoireRoutes);
app.use(accueilRoutes);
app.use(contactRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(commandeRoutes);
app.use(panierRoutes);
app.use(espaceClientRoutes);
app.use(spirulineBioRoutes);
app.use(successRoutes);
app.use(chargementPaiementRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 