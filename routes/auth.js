const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs'); // Importer bcrypt.js
const router = express.Router();
const fetch = require('node-fetch');
const csrfProtection = csrf({ cookie: true });
const { createClient } = require('@supabase/supabase-js');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const supabaseURL = "https://gvywdfacvjnnzrsatwdt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXdkZmFjdmpubnpyc2F0d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTA0MDcsImV4cCI6MjAzNTA4NjQwN30.zrOomQ_zeLLV-a6LlxsKYyGaJsocHW2UcK1uY-AbQFg";
const supabase = createClient(supabaseURL, supabaseKey);

router.use(cookieParser());

// Route REGISTER - GET
router.get('/register', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    res.render('register', { csrfToken: csrfToken });
});

// Route REGISTER - POST
router.post('/register', csrfProtection, async (req, res) => {
    const { email, password, adresse, telephone, Nom, Prenom } = req.body;

    const userAddress = adresse; 
    const destinationAddress = '59200 Tourcoing'; 
    const userCoords = await getCoordinates(userAddress);
    const destinationCoords = await getCoordinates(destinationAddress);

    if (!userCoords || !destinationCoords) {
        return res.status(400).json({ error: 'Impossible de trouver les coordonnées de l\'adresse.' });
    }

    const distance = getDistanceFromLatLonInKm(userCoords.lon, userCoords.lat, destinationCoords.lon, destinationCoords.lat);
    console.log("Distance : " + distance + " km");

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    let insertData = {
        email,
        password: hashedPassword,
        address: adresse,
        phone_number: telephone,
        last_name: Nom,
        first_name: Prenom
    };

    if (distance <= 15) {
        insertData.free_shipping = true;
    }

    const { error } = await supabase
        .from('users')
        .insert([insertData]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.redirect('/login');
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

// Fonction pour calculer la distance entre deux points géographiques
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Route LOGIN - GET
router.get('/login', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    res.render('login', { csrfToken: csrfToken });
});

// Route LOGIN - POST
router.post('/login', csrfProtection, async (req, res) => {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error || users.length === 0) {
        return res.status(400).send('Utilisateur non trouvé.');
    }

    const user = users[0];

    // Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Mot de passe incorrect');
    }

    const { data: products, error2 } = await supabase
        .from('products')
        .select('*');

    if (error2) {
        return res.status(500).json({ error: error2.message });
    }

    console.log(user);

    res.render('accueil', { user, products });
});

// Déconnexion
router.get('/logout', (req, res) => {
    res.redirect('/');
});

module.exports = router;
