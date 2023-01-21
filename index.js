const express = require("express");
const mongoose = require("mongoose")


require('dotenv').config()

mongoose.connect(process.env.DATABASE,{useNewUrlParser:true}).then(()=>console.log('DB Connected!')).catch(err=>console.error(err))

var env = process.env.NODE_ENV || "development";
var config = require("./src/configs/general.config")[env];

const app = express();
app.listen(config.server.port, () =>
  console.log(`Server listening at server port ${config.server.port}`)
);



// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
// const modelRouter = require("./routes/model"); //Import routes for "catalog" area of site
// const pageRouter = require("./routes/page"); //Import routes for "catalog" area of site


// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/page", pageRouter); 
//we can change the model by using /page/model/create etc.
