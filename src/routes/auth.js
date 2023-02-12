const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchUser");

require("dotenv").config();

// Route 1
// Create a new user at POST: "/api/createuser"

router.post(
  "/createUser",
  [
    body("username", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 letters ").isLength({
      min: 5,
    }),
    // body("phone", "Phone Number should be of 10 digits").isLength(10),
  ],
  async (req, res) => {
    let success = false;
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // check whether the user with this email exist already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        console.log("here");
        return res.status(400).json({
          success: false,
          errors: "Sorry a user already exist with this email ",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.username,
        email: req.body.email,
        password: secPass,
        // college: req.body.college,
        // phone: req.body.phone,
        // gender: req.body.gender,
        // yearOfStudy: req.body.yearOfStudy,
        // course: req.body.course,
      });
      console.log(user);
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      //     console.log(authToken);

      //     res.json(user);
      success = true;
      res.json({ success: true, user });
      // res.json(user)
    } catch (error) {
      console.error(error.message, "error catch");
      res.status(500).send("Some error request");
    }
  }
);

// Route 2
// Create a User using: POST "/api/login". no login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // is there are errors, return bad request and the errors
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user);

      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please try to login with correct credentials",
          });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        let success = false;
        return res
          .status(400)
          .json({
            success: false,
            error: "Please try to login with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      console.log(user);
      res.json({ success: true, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error occured");
    }
  }
);

// Route 3
// Get loggedin user details using: POST "api/getUser". login required
// just add auth-token in the header of the query

router.post("/getUser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 4
//Update an existing Uer using: POST "/api/updateUser/:id". login required

router.put("/updateUser/:id", fetchuser, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      phone,
      gender,
      yearOfStudy,
      course,
    } = req.body;

    // Create a newUser object
    const newUser = {};

    if (name) {
      newUser.name = name;
    }
    if (email) {
      newUser.email = email;
    }
    if (password) {
      newUser.password = password;
    }
    if (college) {
      newUser.college = college;
    }
    if (phone) {
      newUser.tag = tag;
    }
    if (gender) {
      newUser.tag = gender;
    }
    if (yearOfStudy) {
      newUser.yearOfStudy = yearOfStudy;
    }
    if (course) {
      newUser.course = course;
    }

    // Find the user to be updfated and update it
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not found");
    }

    //   if (user._id !== req.user.id) {
    //     return res.status(401).send("Not Allowed");
    //   }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newUser },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});

//ROUTE 4
//Delete an existing user using: DELETE "/api/deletenote/:id". login required

router.delete("/deleteUser/:id", fetchuser, async (req, res) => {
  try {
    // Find the user to be delted and delete it
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not found");
    }

    // Allow deletion only if user owns this Note
    //   if (note.user.toString() !== req.user.id) {
    //     return res.status(401).send("Not Allowed");
    //   }

    user = await User.findByIdAndDelete(req.params.id);

    res.json({ Success: "User has been deleted", user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error occured");
  }
});

module.exports = router;
