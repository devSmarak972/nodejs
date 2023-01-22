const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  email: {
   type: String,
   required: true,
   unique: true
},
password:{
  type: String,
  required: true
},
  college: {
    type: String,
    required: true
}, 
  phone: {
    type: String,
    required: true
},
gender: {
    type: String,
    required: true
},
yearOfStudy: {
    type: Number,
    required: true
},
course: {
    type: String,
    required: true
},
date:{
  type:Date,
  default: Date.now
},
posted:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'competition'
}],
applied:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'competition'
}],
});

module.exports = mongoose.model("user", User, "user");
