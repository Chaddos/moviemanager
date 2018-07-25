/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : 'www.db4free.net',
              user     : 'destro',
              password : 'root1234',
              database : 'user_login'
            });
 
connection.connect();
 
global.db = connection;

 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only
 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post

app.get('/home/editprofile/:id', user.editprofile); 
app.post('/home/editprofile/:id',user.save_editprofile);

app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.get('/home/movies',user.movies);//to render movies
app.get('/home/addmovie',user.addmovie);//to add movie
app.post('/home/addmovie',user.addmovie);//to add movie
app.get('/home/edit/:id', user.edit); 
app.post('/home/edit/:id',user.save_edit);
app.get('/home/deletemovie/:id', user.delete_movie);
app.post('/home/search', user.search);
app.post('/home/deleteall', user.delete_all);







//Middleware
app.listen(process.env.PORT || 8080)
