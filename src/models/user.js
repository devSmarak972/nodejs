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
    // required: true
}, 
  phone: {
    type: String,
    // required: true
},
gender: {
    type: String,
    // required: true
},
yearOfStudy: {
    type: Number,
    // required: true
},
course: {
    type: String,
    // required: true
},
date:{
  type:Date,
  default: Date.now
},
posted:[{
  competition:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'competition'
},
team:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user'
}]
}
],
applied:[{
  competition:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'competition',
},
accepted :{
  type: Boolean,
},
  message :{
    type:String,
  }
}
],
});

module.exports = mongoose.model("user", User, "user");
