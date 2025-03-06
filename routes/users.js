
const db = require('../db');
const express = require('express');
const router = express.Router();

const logger = require("../logger");

const {successResponse, errorResponse} = require('../responseHelper');

//create user
router.post("/", async (req,res) => {
    try {
        const {name, email, role} = req.body;
        if(!name || !email || !role) {
            return res.status(404).json(errorResponse(404, "Please fill all field"));
        }
        const [result] = await db.query("INSERT INTO TBL_USERS (name, email, role) VALUES (?,?,?)", [name, email, role])
        res.status(200).json(successResponse(200, `Register User Successfully. [${result.insertId}]`));
    } catch (error) {
        res.status(500).json(errorResponse(500, "error when retrieve data"))
    }
})

//GET USER
router.get("/", async (req,res) => {
    try {
        const [rows] = await db.query("SELECT * FROM TBL_USERS")
        res.status(200).json(successResponse(200, rows))
    } catch (error) {
        res.status(500).json(errorResponse(500, "error when retrieve data"))
    }
})

//Update User 
router.patch("/:id", async (req,res) => {
   try{
    const {id} = req.params;
    console.log(id)
    const {adminId ,name, email, role} = req.body;

    logger.info(`Update Request for User ID ${id} by Admin ID ${adminId}`);

    //Check the is user or admin 
    const [adminResult] = await db.query("SELECT * FROM TBL_USERS WHERE id = ?" , [adminId]);

    if(adminResult.length > 0  && adminResult[0].ROLE != "ADMIN") {
        return res.status(403).json(errorResponse(403, "You dont have authorize for this!"))
    }

    const [currentUser] = await db.query("SELECT * FROM TBL_USERS WHERE id = ?", [id])

    if(currentUser.length ===0) {
        return res.status(404).json(errorResponse(404, "user not found!"))
    }

    const updates = [];
    const values = [];

    if(name) {
        updates.push("name = ?")
        values.push(name);
    }

    if(role) {
        updates.push("role = ?")
        values.push(role)
    }

    if(email) {
        updates.push("email = ?")
        values.push(email);
    }

    values.push(id)
    console.log(updates.join(", "))
    await db.query(`UPDATE TBL_USERS SET ${updates.join(", ")} WHERE id = ?`, values);

    const [updatedUser] = await db.query("SELECT * FROM TBL_USERS WHERE id = ? ", id);

    logger.info(`User ID ${id} updated successfully`);
    res.status(200).json(successResponse(200,updatedUser))
   }catch(error) {
    logger.error(error)
    res.status(500).json(errorResponse(500, "Database error"));
   }
})

module.exports = router;