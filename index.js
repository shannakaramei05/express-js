require("dotenv").config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware (using json body)
app.use(express.json());

const usersRoute = require("./routes/users");
const warehouseRoute = require("./routes/warehouse")
<<<<<<< Updated upstream
=======
const consumerRoute = require("./routes/consumer")
const itemsRoute = require("./routes/products");
>>>>>>> Stashed changes

//route
app.use("/v1/users",usersRoute );
app.use("/v1/warehouse", warehouseRoute)
<<<<<<< Updated upstream

=======
app.use("/v1/consumers", consumerRoute)
app.use("/v1/products",itemsRoute)
>>>>>>> Stashed changes

//listen
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})