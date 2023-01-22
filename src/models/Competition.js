const mongoose = require("mongoose");

const Competition = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    img:{
      type:String,
      required:false,
    },
    status:{
      type:String,
      required:false,
    },
    domain:{
      type:String,
      required:false,
    },
  category:[{
    type: String,
    required:false,
  }],
  applied:{
    type:Number,

  },
  title: {
    type: String,
    required:false,
  },
  orgName: {
    type: String,
    required:false,
  },
  url:{
    type:String,
  },
  mode: {
    type: String,
    required:false,
  },

  visibility: {
    type: String,
    default: "public",
  }, 
  eligibility: {
    type: String,
    // required:false,
  },
  prize: {
    winner: String,
    firstRunnerUp: String,
    secondRunnerUp: String,
  },
  teamsize: {
    type: Number,
    required:false,
  },
  fee: {
    type: String,
    required:false,
  },
  updatedOn:{
    type: Date,
    default: Date.now()
  },
  regDeadline: {
    type: Date,
    required:false,
  },
  startDate: {
    type: Date,
    required:false,
  },
  endDate: {
    type: Date,
    required:false,
  },
  rewards: {
    type:String,
  },
  incentive:{
    type:String,
  },
  desc:{
    type:String,
    required:false,
  },
  rounds: 
    [
      {
        description: {
          type: String,
          required:false,
        },
      },
    ],

});

module.exports = mongoose.model("competition", Competition, "competition");
