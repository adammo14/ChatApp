const express = require('express');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const config = require('./config/database');
const PORT = process.env.PORT || 9999;
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp';

//connect to db
mongoose
  .connect(CONNECTION_URI, {
    'useMongoClient': true
  });

const app = express();

//static files
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/fonts', express.static('fonts'));

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
  secret: 'adamsky',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//load view engine
app.engine('handlebars', handlebars({extname: 'handlebars'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//models
let User = require('./models/user');
let Bot = require('./models/bot');

//home route
app.get('/', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/dashboard/:id');
});

//logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/registration', function(req, res){
  res.render('registration');
});

//registration functionality
app.post('/registration', function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const email = req.body.email;
  const gender = req.body.gender;
  const age = req.body.age;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();

  if(errors){
    res.render('registration', {
      errors:errors,
      msg:'oops, something went wrong...'
    });
  }else{
    let newUser = new User({
      username:username,
      password:password,
      password2:password2,
      email:email,
      gender:gender,
      age:age
    });
    //password hashing
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password && newUser.password2, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.password2 = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else{
            res.render('index', {msg: 'You have been registered and can now log in!'})
          }
        });
      });
    });
  }
});

//dashboard route
app.get('/dashboard/:id', function(req, res){
  res.render('dashboard');
});

app.get('/dashboard2/:id', function(req, res){
  res.render('dashboard2');
});

app.get('/dashboard3/:id', function(req, res){
  res.render('dashboard3');
});

//dashboard update
app.get('/dashboard/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('dashboard', {
      user:user
    });
  });
});

app.post('/dashboard/:id', function(req, res){
  let user = {};

  user.gender = req.body.gender;
  user.age = req.body.age;

  let query = {_id:req.params.id}

  User.update(query, user, function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/dashboard/:id');
    }
  });
});

//Personality test

app.post('/dashboard2/:id', function(req, res){

  let user = {};

  user.personalityVal = parseFloat(req.body.radiosQ1) +
                        parseFloat(req.body.radiosQ2) +
                        parseFloat(req.body.radiosQ3) +
                        parseFloat(req.body.radiosQ4) +
                        parseFloat(req.body.radiosQ5) +
                        parseFloat(req.body.radiosQ6) +
                        parseFloat(req.body.radiosQ7) +
                        parseFloat(req.body.radiosQ8) +
                        parseFloat(req.body.radiosQ9) +
                        parseFloat(req.body.radiosQ10);

  user.genderMatch = req.body.radiosQ11;

  if (user.personalityVal <= 13){
    user.personality = 'Extrovert';
  }
  else if (user.personalityVal >= 17){
    user.personality = 'Introvert';
  }
  else {
    user.personality = 'Ambivient';
  }

  let query = {_id:req.params.id}

  User.update(query, user, function(err){
    if(err){
    console.log(err);
    } else {
      res.redirect('/dashboard2/:id');
    }
  });
});

//HANDLEBARS CUSTOM HELPERS
Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
    var operators, result;
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    result = operators[operator](lvalue, rvalue);
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('calculate', function(lvalue, operator, rvalue, options){
  var operators, result;
  if(arguments.length < 3){
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  }
  if (options === undefined) {
      options = rvalue;
      rvalue = operator;
      operator = "===";
  }
  operators = {
    '+': function(l, r) {return l + r},
    '-': function(l, r) {return l - r},
    '*': function(l, r) {return l * r},
    '/': function(l, r) {return l / r}
  };
  if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
  }
  result = operators[operator](lvalue, rvalue);
  if (result) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});

//start server

app.listen(PORT, function(){
  console.log('Server is active on port 9999...');
});
