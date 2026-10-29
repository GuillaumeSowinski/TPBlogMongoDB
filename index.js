const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const BlogPost = require('./src/models/blogPost');
const storeUserController = require('./src/controllers/storeUser.js');
const loginController = require('./src/controllers/login.js');
const registerController = require('./src/controllers/register.js');
const loginUserController = require('./src/controllers/loginUser.js');
const authMiddleware = require('./src/middleware/authMiddleware.js');
const redirectIfAuthenticatedMiddleware = require('./src/middleware/redirectIfAuthenticatedMiddleware.js');
const storePostController = require('./src/controllers/storePost.js');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'change moi en production',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(flash());

// Expose l'état de connexion aux vues (pattern du tuto)
global.loggedIn = null;

app.use((req, res, next) => {
    global.loggedIn = req.session.userId;
    next();
});

// --- Moteur de vues EJS ---
app.set('view engine', 'ejs');
app.set('views', './views');

// --- Connexion MongoDB ---
mongoose.connect('mongodb://localhost/my_blog')
    .then(() => console.log('Connexion done to mongo db my_blog'))
    .catch(err => console.error('Connexion error:', err));

// --- Routes ---

// Page d'accueil : liste tous les articles
app.get(['/', '/home'], async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ _id: -1 });
        res.render('index', { posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// Page de création d'un article — doit être déclarée avant /post/:id
app.get('/post/new', authMiddleware, (req, res) => {
    res.render('newPost');
});

// Page d'un article
app.get('/post/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.render('post', { post });
    } catch (err) {
        res.status(404).send('Article introuvable');
    }
});

// Page "À propos"
app.get('/about', (req, res) => {
    res.render('about');
});

// Page "Contact"
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Enregistrement d'un utilisateur
app.post('/users/register', storeUserController);

// Connexion d'un utilisateur
app.post('/users/login', loginUserController);

// Création d'un article
app.post('/posts/store', authMiddleware, storePostController);

// Page d'inscription
app.get('/auth/register', redirectIfAuthenticatedMiddleware, registerController);

// Page de connexion
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

// Déconnexion
app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// --- Démarrage serveur ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});