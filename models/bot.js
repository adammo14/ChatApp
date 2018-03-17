let mongoose = require('mongoose');

//Bot schema
let BotSchema = mongoose.Schema({
  name:{
    type: String,
  },
  gender:{
    type: String
  },
  age:{
    type: Number
  },
  personalityVal:{
    type: Number
  },
  personality:{
    type: String
  }
});

let Bot = module.exports = mongoose.model('Bot', BotSchema);
