const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const MongoClinet = require('mongodb').MongoClient


var env = process.env.NODE_ENV || "development";
var config = require("./src/configs/general.config")[env];
require("dotenv").config();
const  bodyparser=require("body-parser");
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true}).then(()=>console.log('DB Connected!')).catch(err=>console.log(err))

const app = express();
app.use(cors());
app.use(express.json())

app.listen(config.server.port, () =>
  console.log(`Server listening at server port ${config.server.port}`)
);
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/comp', require('./src/routes/competitions'))

// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
// const modelRouter = require("./src/routes/model"); //Import routes for "catalog" area of site
// const pageRouter = require("./routes/page"); //Import routes for "catalog" area of site
// const { default: mongoose } = require("mongoose");

// app.use("/", indexRouter);
// app.use("/api", modelRouter);
// app.use("/page", pageRouter);
// //we can change the model by using /page/model/create etc.

