const express = require('express');
const path = require('path');
const useragent = require('express-useragent')
const routes = require('./routes');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 5000;
const url = 'mongodb+srv://naguser:naguser123@nagcluster.8rb3w.mongodb.net/quicknotes_db?retryWrites=true&w=majority';
const mongoose = require('mongoose');

/* SETTING UP THE SERVER */

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(useragent.express());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));

app.use('/', routes);
app.listen(port, ()=>{console.log(`Server running on port ${port.toString()}`)});

/* ----------------------- */


/* WRITING THE LOGIC FOR only get method of HOME PAGE */
/* REMAINING ROUTES ARE IN routes.js*/

app.get('/', (req, res) => {
    if(req.session.username){
        res.redirect('/dashboard');
    }
    res.render('signin_htm');

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

    const db = mongoose.connection
    db.once('open', () => {
        console.log('Database connected to', url)
    })

    db.on("error", function(err) {
        console.log("Could not connect to the database!");
    });
})

/* -------------------------------- */
