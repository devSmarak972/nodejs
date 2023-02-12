const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Competition = require("../models/Competition");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchUser");
require("dotenv").config();
var ObjectId = require("mongoose").Types.ObjectId;

// ROUTE 1:
//Get all the notes using: GET "/api/comp/fetchallcomp". login required
router.get("/fetchallcomp", async (req, res) => {
  try {
    const comp = await Competition.find({}).populate("user");
    res.json(comp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});
router.get("/fetchcomp/:id", async (req, res) => {
  try {
    const comp = await Competition.find({ id: req.params.id }).populate("user");
    res.json(comp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});
router.get("/usercomp/:id", async (req, res) => {
  console.log("here", req.params.id, typeof req.params.id);
  try {
    const comp = await Competition.find({
      user: ObjectId(req.params.id),
    }).populate("user");
    console.log(comp);
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
        mode,
        eligibility,
        prize,
        teamsize,
        fee,
        regDeadline,
        startDate,
        endDate,
        rewards,
        desc,
        incentives,
        url,
        uid,
        status,
        domain,
      } = req.body;
      // console.log(Date.now(),new Date(Date.parse(regDeadline)));
      // req.body["status"]=Date.now()>(new Date(Date.parse(regDeadline))).now()?"Live":"Expired";
      req.body["status"] = "Live";
      // is there are errors, return bad request and the errors
      const errors = validationResult(req);
      console.log("here", req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let comp = await Competition.findOne({
        title: req.body.title,
        user: uid,
      });
      if (comp) {
        return res.status(400).json({
          errors: "Sorry a competition already exist with this title ",
        });
      }
      console.log(req.body.uid);
      comp = new Competition({
        img,
        title,
        orgName,
        mode,
        // visibility,
        eligibility,
        prize,
        teamsize,
        fee,
        regDeadline,
        startDate,
        endDate,
        rewards,
        desc,
        incentives,
        url,
        domain,
        status,
        user: uid,
      });

      const savedComp = await comp.save();

      postinguser = await User.findById(uid);
      if (postinguser) {
        postinguser.posted.push({
          competition: savedComp._id,
          team: [uid],
        });
        postinguser.save();
      }

      console.log(postinguser);
      console.log(savedComp);
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
      newComp.eligibility = eligibility;
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
router.post("/apply", async (req, res) => {
  try {
    // Find the competition to be deleted and delete it
    console.log(req.body);
    let comp = await Competition.findById(req.body.compid);
    if (!comp) {
      return res.status(404).send("Not found");
    }
    console.log(comp);

    applyinguser = await User.findById(req.body.uid);
    applyinguser.applied.push({
      competition: comp._id,
      accepted: false,
      message: "",
    });
    applyinguser.save();

    console.log(applyinguser);

    res.json({ comp });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});
module.exports = router;

router.post("/apply", async (req, res) => {
  try {
    // Find the competition to be deleted and delete it
    console.log(req.body);
    let comp = await Competition.findById(req.body.compid);
    if (!comp) {
      return res.status(404).send("Not found");
    }
    console.log(comp);

    applyinguser = await User.findById(req.body.uid);
    applyinguser.applied.push({
      competition: comp._id,
      accepted: false,
      message: "",
    });
    applyinguser.save();

    console.log(applyinguser);

    res.json({ comp });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});
module.exports = router;
