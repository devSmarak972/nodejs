const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Competition = require("../models/Competition");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchUser");
require("dotenv").config();

// ROUTE 1:
//Get all the notes using: GET "/api/comp/fetchallcomp". login required
router.get("/fetchallcomp", fetchuser, async (req, res) => {
  try {
    const comp = await Competition.find({ user: req.user.id });
    res.json(comp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});

// ROUTE 2:
//Add a new competition using: POST "/api/comp/addcomp". login required
router.post(
  "/addcomp",
  fetchuser,
  [
    body("title", "Enter a Valid title").isLength({ min: 3 }),
    //   body("description", "Description must be atleast 5 chracters ").isLength({
    //     min: 5,
    //   }),
  ],
  async (req, res) => {
    try {
      const {
        img,
        title,
        orgName,
        modeOfEvent,
        visibility,
        eligibility,
        priceMoney,
        teamSize,
        fee,
        regDeadline,
        startDate,
        endDate,
        rewards,
        description,
      } = req.body;
      // is there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let comp = await Competition.findOne({ title: req.body.title });
      if (comp) {
        return res
          .status(400)
          .json({errors: "Sorry a competition already exist with this title " });
      }
    
       comp = new Competition({
        img,
        title,
        orgName,
        modeOfEvent,
        visibility,
        eligibility,
        priceMoney,
        teamSize,
        fee,
        regDeadline,
        startDate,
        endDate,
        rewards,
        description,
        user: req.user.id,
      });

      const savedComp = await comp.save();
      res.json(savedComp);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error occured");
    }
  }
);


//ROUTE 3
//Update an existing competition using: POST "/api/comp/updatecomp/:id". login required

router.put("/updatecomp/:id", fetchuser, async (req, res) => {
    try {
        const {
            img,
            title,
            orgName,
            modeOfEvent,
            visibility,
            eligibility,
            priceMoney,
            teamSize,
            fee,
            regDeadline,
            startDate,
            endDate,
            rewards,
            description,
          } = req.body;
  
      // Create a newComp object
      const newComp = {};
  
      if (title) {
        newComp.title = title;
      }
      if (description) {
        newComp.description = description;
      }
      if (img) {
        newComp.img = img;
      }
      if (orgName) {
        newComp.orgName = orgName;
      }
      if (modeOfEvent) {
        newComp.modeOfEvent = modeOfEvent;
      }
      if (visibility) {
        newComp.visibility = visibility;
      }
      if (eligibility) {
        newComp.eligibility =eligibility;
      }
      if (priceMoney) {
        newComp.priceMoney = priceMoney;
      }
      if (teamSize) {
        newComp.teamSize = teamSize;
      }
      if (fee) {
        newComp.fee = fee;
      }
      if (regDeadline) {
        newComp.regDeadline = tag;
      }
      if (endDate) {
        newComp.endDate = endDate;
      }
      if (rewards) {
        newComp.rewards = rewards;
      }
  
      // Find the competition to be updfated and update it
      let comp = await Competition.findById(req.params.id);
      if (!comp) {
        return res.status(404).send("Not found");
      }
  
      if (comp.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
  
      comp = await Competition.findByIdAndUpdate(
        req.params.id,
        { $set: newComp },
        { new: true }
      );
      res.json({ comp });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error occured");
    }
  });



  //ROUTE 4
//Delete an existing Competition using: POST "/api/comp/deletecomp/:id". login required

router.delete("/deletecomp/:id", fetchuser, async (req, res) => {
    try {
  
      // Find the competition to be deleted and delete it
      let comp = await Competition.findById(req.params.id);
      if (!comp) {
        return res.status(404).send("Not found");
      }
  
      // Allow deletion only if user owns this Note
      if (comp.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
  
      comp = await Competition.findByIdAndDelete(req.params.id);
  
      res.json({ Success: "Note has been deleted", comp: comp });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error occured");
    }
  });
module.exports = router;
