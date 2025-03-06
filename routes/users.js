
const db = require('../db');
const express = require('express');
const router = express.Router();

const {successResponse, errorResponse} = require('../responseHelper');

//create user
router.post("/", async (req,res) => {
    try {
        const [rows] = await db.query("SELECT * FROM TBL_USERS")
        res.status(200).json(successResponse(200, rows))
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


module.exports = router;