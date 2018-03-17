let mongoose = require('mongoose');

//User schema
let UserSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  password2:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  gender:{
    type: String
  },
  age:{
    type: String
  },
  personalityVal:{
    type: Number
  },
  personality:{
    type: String
  },
  genderMatch:{
    type: String
  }
});

let User = module.exports = mongoose.model('User', UserSchema);
