
const db = require('../db')
const express = require('express');

const router = express.Router();
const {errorResponse, successResponse} = require("../responseHelper.js");
const logger = require("../logger.js")
const {getWarehouseById} = require("../services/warehouse-services")


//Get Data warehouse
router.get(["/" , "/:id"] , async (req,res) => {
    try {
        const {id} = req.params;

<<<<<<< Updated upstream
        const sql = id ? "SELECT * FROM TBL_WAREHOUSE WHERE id = ? " : "SELECT * FROM TBL_WAREHOUSE";
        const values = id ? [id] : [];

        const [result] = await db.query(sql, values);
        logger.info("result : " + result)
=======
        const result = await getWarehouseById(id);
        logger.info("result : " + JSON.stringify(result, null, 2))
>>>>>>> Stashed changes

        if(id && result.length ===0 ) {
            return res.status(404).json(errorResponse(404, "Warehouse not found!"))
        }
        res.status(200).json(successResponse(200, result.length === 1 ? result[0] : result))
    } catch (error) {
        logger.error(error)
        res.status(500).json(errorResponse(500, "Error when retrieve data"))
    }

})

<<<<<<< Updated upstream
=======
router.post("/update", async (req,res) => {
    try{
        const {wrId,name, sku,addrWr} = req.body;

        const curWr = await getWarehouseById(wrId);

        if(curWr.length === 0) {
            return res.status(404).json(errorResponse(404, "Warehouse not found"))
        }

        if(!name || !sku || !addrWr) {
            return res.status(404).json(errorResponse(404,"please fill all field"))
        }
        const query = "UPDATE TBL_WAREHOUSE SET NAME = ?, SKU = ? , ADDR_WR = ? WHERE id = ?";
        const values = [name, sku, addrWr, wrId];

        const [result] = await db.query(query,values);

        res.status(201).json(successResponse(201,`Success Update Warehouse with id ${wrId}`))

    }catch (e) {
        logger.error(e);

    }
})

>>>>>>> Stashed changes


module.exports = router;