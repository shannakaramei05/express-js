require("dotenv").config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware (using json body)
app.use(express.json());

const usersRoute = require("./routes/users");
const warehouseRoute = require("./routes/warehouse")
const consumerRoute = require("./routes/consumer")

//route
app.use("/v1/users",usersRoute );
app.use("/v1/warehouse", warehouseRoute)
app.use("/v1/consumers", consumerRoute)


//listen
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})