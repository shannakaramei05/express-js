const db = require("../db");
const express = require("express");
const router = express.Router();

const logger = require("../logger");

const { successResponse, errorResponse } = require("../responseHelper");
const { getUserById, isUserAdmin , isUserManager} = require("../services/user-services");
const {createShipmentRequest} = require("../services/inventory-services")
//create user
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(404).json(errorResponse(404, "Please fill all field"));
    }
    const [result] = await db.query(
      "INSERT INTO TBL_USERS (name, email, role) VALUES (?,?,?)",
      [name, email, role]
    );
    res
      .status(200)
      .json(
        successResponse(200, `Register User Successfully. [${result.insertId}]`)
      );
  } catch (error) {
    res.status(500).json(errorResponse(500, "error when retrieve data"));
  }
});

//GET USER
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM TBL_USERS");
    res.status(200).json(successResponse(200, rows));
  } catch (error) {
    res.status(500).json(errorResponse(500, "error when retrieve data"));
  }
});

//Update User
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { adminId, name, email, role } = req.body;

    logger.info(`Update Request for User ID ${id} by Admin ID ${adminId}`);

    //Check the is user or admin
    const isAdmin = await isUserAdmin(adminId);

    logger.info("isAdmin : " + isAdmin);

    if (!isAdmin) {
      return res
        .status(403)
        .json(errorResponse(403, "You dont have authorize for this!"));
    }

    const currentUser = await getUserById(id);

    if (currentUser.length === 0) {
      return res.status(404).json(errorResponse(404, "user not found!"));
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }

    if (role) {
      updates.push("role = ?");
      values.push(role);
    }

    if (email) {
      updates.push("email = ?");
      values.push(email);
    }

    values.push(id);
    console.log(updates.join(", "));
    await db.query(
      `UPDATE TBL_USERS SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const updatedUser = await getUserById(id);

    logger.info(`User ID ${id} updated successfully`);
    res.status(200).json(successResponse(200, updatedUser));
  } catch (error) {
    logger.error(error);
    res.status(500).json(errorResponse(500, "Database error"));
  }
});

//verify consumer
router.post("/verify", async (req, res) => {
  try {
    const { adminId, companyId, verify } = req.body;

    const isAdmin = await isUserAdmin(adminId);

    logger.info(`Admin --> [${JSON.stringify(isAdmin, null, 2)}]`);

    if (!isAdmin) {
      return res
        .status(403)
        .json(errorResponse(403, "you have no authorize for doing this."));
    }

    const sql = "UPDATE TBL_CONSUMERS SET IS_VERIFY = ? WHERE id = ?";
    const values = [verify, companyId];

    const [verifyConsumer] = await db.query(sql, values);
    res.status(201).json(successResponse(201, verifyConsumer));
  } catch (e) {
    logger.error(e);
    res.status(500).json(errorResponse(500, "Database Error"));
  }
});


router.post("/request/verify", async (req,res) => {
  try{

    const { adminId, requestId, warehouseId } = req.body;
    const isAdmin = await isUserAdmin(adminId);

    logger.info(`Admin --> [${JSON.stringify(isAdmin, null, 2)}]`);

    logger.info(requestId)
    logger.info(requestId.map(id=>'?').join(", "))

    if (!isAdmin) {
      return res
          .status(403)
          .json(errorResponse(403, "you have no authorize for doing this."));
    }

    await db.query("START TRANSACTION")
    for (let i = 0; i < requestId.length; i++) {
      const sql = `
        UPDATE TBL_CONSUMER_REQUEST 
        SET STATUS = "VERIFY", VERIFY_BY = ?, UPDATED_AT = ?, WR_ID = ?
        WHERE REQUESTED_BY = ?
      `;
      const values = [adminId, new Date(), warehouseId[i], requestId[i]];
      await db.query(sql, values); // Execute the update for each requestId
    }

    await db.query("COMMIT"); // Commit transaction

    res.status(200).json(successResponse(200,"Request Verified"));

  }catch (e) {
    await db.query("ROLLBACK"); // Rollback transaction on error
    logger.error(e)
    res.status(500).json(errorResponse(500,"Invalid Request"))
  }
})


router.post("/request/approve", async (req,res) => {
  try{

    const { managerId, requestId, consumerId } = req.body;
    const isManager = await isUserManager(managerId);

    logger.info(`manager --> [${JSON.stringify(isManager, null, 2)}]`);

    if (!isManager) {
      return res
          .status(403)
          .json(errorResponse(403, "you have no authorize for doing this."));
    }

    //more complex can do inq warehouse
    //checking the stocks

    await db.query("START TRANSACTION")
    const sql = `
      UPDATE TBL_CONSUMER_REQUEST 
      SET STATUS = "APPROVED", APPROVED_BY = ? , UPDATED_AT = ?
      WHERE ID = ? AND REQUESTED_BY = ? AND STATUS = "VERIFY"
    `;
    const values = [managerId, new Date(),requestId, consumerId];
    await db.query(sql, values); // Execute the update for each requestId

    await db.query("COMMIT"); // Commit transaction

    const [result] = await db.query(sql,values);

    //create a shipment
    const apprvRequest = await createShipmentRequest(requestId);
    const apprvStatus = "APPROVED";
    const shipment = 'INSERT INTO TBL_SHIPMENT (WR_ID, QUANTITY, STATUS, REQUESTED_BY, APPROVED_BY, DESTINATION) VALUES (?,?,?,?,?,?)'
    const [consumerVal] = await db.query("SELECT * FROM TBL_CONSUMERS WHERE id = ?" , [consumerId]);
    const shipmentValues = [apprvRequest.WR_ID, apprvRequest.QUANTITY, apprvStatus , apprvRequest.REQUESTED_BY, apprvRequest.APPROVED_BY,consumerVal[0].ADDRESS]


    const [dataShimpent] = await db.query(shipment,shipmentValues)
    res.status(200).json(successResponse(200,"ITEMS ON THE WAY"));

  }catch (e) {
    logger.error(e)
    res.status(500).json(errorResponse(500,"Invalid Request"))
  }
})

module.exports = router;
