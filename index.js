require("dotenv").config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware (using json body)
app.use(express.json());

const usersRoute = require("./routes/users");


//route
app.use("/v1/users",usersRoute );


//listen
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})