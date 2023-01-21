const mongoose = require("mongoose");

const Competition = mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  orgName: {
    type: String,
    required: true,
  },
  modeOfEvent: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    required: true,
  }, //boolean
  eligibility: {
    type: String,
    required: true,
  },
  priceMoney: {
    type: Number,
    required: true,
  },
  teamSize: {
    type: Number,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  regDeadline: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  rewards: {
    winner: Number,
    firstRunnerUp: Number,
    secondRunnerUp: Number,
  },
  description: {
    rounds: [
      {
        roundNumber: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("competition", Competition, "competition");