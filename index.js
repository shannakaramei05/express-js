require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors')

// middleware (using json body)
app.use(express.json());
app.use(cors())

const usersRoute = require("./routes/users");
const warehouseRoute = require("./routes/warehouse");
const consumerRoute = require("./routes/consumer");
const itemsRoute = require("./routes/products");

//route
app.use("/v1/users", usersRoute);
app.use("/v1/warehouse", warehouseRoute);
app.use("/v1/consumers", consumerRoute);
app.use("/v1/products", itemsRoute);

//listen
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
