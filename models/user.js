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
  },                  //Registration
  color:{
    type: String
  },
  personalityVal:{
    type: Number
  },
  personality:{
    type: String
  },
  preferedGender:{
    type: String
  },                  //Dashbord 2
  nameMatch:{
    type: String
  },
  personalityMatch:{
    type: String
  },
  colorMatch:[{
    type: String
  }],
  personalityMatchVal:{
    type: Number
  },
  personalityMatchTraits:[{
    type: String
  }],
  personalityTheme:{
    type: Boolean
  }
});

let User = module.exports = mongoose.model('User', UserSchema);
