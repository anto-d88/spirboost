const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//const bcrypt = require('bcrypt');
//const connection = require('../db');
// configuration connection postGreSQL
const { createClient } = require('@supabase/supabase-js');
//const { Pool } = require('pg');
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey);

//const pool = new Pool({ connectionString: process.env.SUPABASE_BD_URL});
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Configurer une clé API Google Maps

// route REGISTER*************************************************************************************
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const userAddress = req.body.adresse; // Adresse entrée par l'utilisateur
  const destinationAddress = '59200 Tourcoing'; 
  // Appel à l'API Nominatim d'OpenStreetMap pour obtenir les coordonnées des adresses
  const userCoords = await getCoordinates(userAddress);
  const destinationCoords = await getCoordinates(destinationAddress);

  if (!userCoords || !destinationCoords) {
      return res.status(400).json({ error: 'Impossible de trouver les coordonnées de l\'adresse.' });
  }

  const distance = getDistanceFromLatLonInKm(userCoords.lon, userCoords.lat, destinationCoords.lon, destinationCoords.lat);
 
  console.log("Distance : " + distance + " km")

 if(distance > 15){
 const { data, error } = await supabase
 .from('users')
 .insert([
   { email: req.body.email, password: req.body.password, address: req.body.adresse, phone_number: req.body.telephone, last_name: req.body.Nom, first_name: req.body.Prenom  },
  ])
  .select()
  if (error) {
    return res.status(500).json({ error: error.message });
      }
   }else{
    const { data, error } = await supabase
 .from('users')
 .insert([
   { free_shipping: true, email: req.body.email, password: req.body.password, address: req.body.adresse, phone_number: req.body.telephone, last_name: req.body.Nom, first_name: req.body.Prenom  },
  ])
  .select()
  if (error) {
    return res.status(500).json({ error: error.message });
      }
   }   
      res.render('login')
  });
// Fonction pour obtenir les coordonnées d'une adresse avec Nominatim (OpenStreetMap)
async function getCoordinates(address) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
  const data = await response.json();
  if (data.length === 0) {
      return null;
  }
  return {
      lat: data[0].lat,
      lon: data[0].lon
  };
}

// Fonction pour convertir les degrés en radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
router.get('/login', (req, res) => {
  res.render('login');
});

// Fonction pour calculer la distance entre deux points géographiques
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Rayon de la Terre en kilomètres
  var dLat = deg2rad(lat2 - lat1);  // Différence de latitude en radians
  var dLon = deg2rad(lon2 - lon1);  // Différence de longitude en radians
  var a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  var distance = R * c; // Distance en kilomètres
  return distance;
}


//route LOGIN***************************************************************
router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  let { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  console.log(users)
if (error) {
        return res.status(500).json({ error: error.message });
    }
    const user = users[0];
    //const match = await bcrypt.compare(password, user.password);
    if (password !== user.password) return res.status(400).send('Mot de passe incorrect'); 
     // req.session.user = user;
     
     const { data: products, error2 } = await supabase
     .from('products')
     .select('*');
   if (error2) throw error2;
   console.log(products)
     
       res.render('accueil', { user: users[0], products: products }); 
});



router.get('/logout', (req, res) => {
  
    res.redirect('/');
  
});

module.exports = router;
