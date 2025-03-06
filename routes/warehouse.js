
const db = require('../db')
const express = require('express');

const router = express.Router();
const {errorResponse, successResponse} = require("../responseHelper.js");
const logger = require("../logger.js")


//Get Data warehouse
router.get(["/" , "/:id"] , async (req,res) => {
    try {
        const {id} = req.params;

        const sql = id ? "SELECT * FROM TBL_WAREHOUSE WHERE id = ? " : "SELECT * FROM TBL_WAREHOUSE";
        const values = id ? [id] : [];

        const [result] = await db.query(sql, values);
        logger.info("result : " + result)

        if(id && result.length ===0 ) {
            return res.status(404).json(errorResponse(404, "Warehouse not found!"))
        }
        res.status(200).json(successResponse(200, result.length === 1 ? result[0] : result))
    } catch (error) {
        logger.error(error)
        res.status(500).json(errorResponse(500, "Error when retrieve data"))
    }

})



module.exports = router;