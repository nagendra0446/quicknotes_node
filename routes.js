const express = require('express');
const route = express.Router();
const useragent = require('express-useragent');
const mongoose = require('mongoose');
const app_user = require('./models/app_user');
const note = require('./models/note');
const url = 'mongodb+srv://naguser:naguser123@nagcluster.8rb3w.mongodb.net/quicknotes_db?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', () => {
  console.log('Database connected:', url)
})

// Missing db.on
// Make the idea of project code bkp ready and implementws
// Console should display some useful info
// 1. Signin route (Evaluation Phase)
route.post('/', (req, res) => {
    /* if(req.session.username){
        res.redirect('/dashboard');
        return;
    } */

    var uname = req.body.uname;
    var pass = req.body.pass;
    app_user.findOne({username: uname, pass: pass}, function (err, result) {
        
        if (err) return console.error(err);

        if(result){
            req.session.username = uname;
            res.redirect('/dashboard');
        } 
        else{
            req.session.msg = 'invalid_creds';
            res.render('signin', {message: 'invalid_creds', useragent})
        }
    })
})


// 2. Dashboard (Only has the get method)
route.get('/dashboard', (req, res) => {
    var uname = req.session.username;
    if(!uname){
        res.redirect('/');
        return;
    }
    note.find({user: uname}, function (err, notes) {
        req.session.username = uname;
        res.render('dashboard', {req, notes});
    }); 
});


// 3. Insert
route.get('/insert', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    res.render('insert_form');
})

route.post('/insert', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    var note_object = {
        user: req.session.username,
        title: req.body.title,
        status: req.body.status,
        notes: req.body.notes
    }
    note.create(note_object, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/dashboard');
        }
    });
})
// Point to remember get -> click url and enter, post -> pressing f5
route.get('/insert', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    var note_object = {
        user: req.session.username,
        title: req.body.title,
        status: req.body.status,
        notes: req.body.notes
    }
    note.create(note_object, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/dashboard');
        }
    });
});



route.post('/update_notes', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    var old_note = {
        id: req.body.id,
        title: req.body.title,
        status: req.body.status,
        notes: req.body.notes
    }
    res.render('update_form', {old_note});
})

route.get('/update_notes', (req, res) => {
    res.redirect('/dashboard');
});

route.post('/update', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    
    //console.log(req.body.id);
    note.findByIdAndUpdate(req.body.id, { 
        title: req.body.title,
        status: req.body.status,
        notes: req.body.notes
    }, 
    function(err, result){
        if (err)
            res.send(err);
        else
            res.redirect('/dashboard');
    });
});

route.get('/update', (req, res) => {
    res.redirect('/dashboard');
});


route.post('/delete', (req, res) => {
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    note.findByIdAndDelete(req.body.id, function(err, result){
        if (err) 
            res.send(err);
        else{
            console.log('Delete Success')
            console.log(result);
            res.redirect('/dashboard');
        }
    });
});

route.get('/delete', (req, res) => {
    res.redirect('/dashboard');
});

route.get('/signup', (req, res) => {
    res.render('signup_form');
});

route.post('/signup', (req, res) => {
    //console.log(req.body);
     var new_user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        username: req.body.uname,
        pass: req.body.pass,
    }

    

    app_user.create(new_user, function(err, result) {
        if (err) {
          res.send(err);
        } else {
            console.log('User Added');
            res.redirect('/');
        }
    })
});

route.get('/logout', (req, res) => {
    res.redirect('/dashboard');
});

route.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

route.post('/profile', (req, res) => {
    uname = req.session.username;
    if(!uname){
        res.redirect('/');
        return;
    }
    app_user.findOne({username: uname}, function (err, user) {
        
        if (err) return console.error(err);
        res.render('profile_page', {user});
    })
});
 
route.get('/profile', (req, res) => {
    uname = req.session.username;
    if(!uname){
        res.redirect('/');
        return;
    }
    app_user.findOne({username: uname}, function (err, user) {
        
        if (err) return console.error(err);

        res.render('profile_page', {user});
    })
});

route.get('/about', (req, res) => {
    res.render('about_page');
});

 module.exports = route;