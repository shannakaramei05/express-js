
const express = require('express')
const db = require('../db')
const logger = require('../logger')
const {errorResponse,successResponse} =require('../responseHelper')

const {isUserAdmin, getUserById} = require("../services/user-services")
const {isProductExist}= require("../services/inventory-services")

const router = express.Router();


//register items
router.post('/register' , async (req,res) => {
    try{
        const {name,productCd,price,category,quantity,wrId,adminId} = req.body;

        logger.info("wrId : " + wrId)
        //checking isAdmin
        const admin = await isUserAdmin(adminId);

        if(!admin) {
            return res.status(403).json(errorResponse(403, "FORBIDDEN ACTION! PLEASE REPORT TO YOUR ADMIN!"))
        }

        if(!name ||!productCd|| !price || !category || !quantity || !wrId) {
            return res.status(404).json(errorResponse(404, "Please Filled All Fields"))
        }

        //checking warehouse id exist
        const [rows] = await db.query(`SELECT COUNT(*) AS count FROM TBL_WAREHOUSE WHERE id in (${wrId.map(id => '? ').join(", ")})`,wrId)

        const existingCount = rows[0].count;

        if(existingCount !== wrId.length){
            return res.status(404).json(errorResponse(404, "please check if the warehouse is exist!"))
        }

        const sql = "INSERT INTO TBL_ITEMS (NAME,PRICE,CATEGORY,QUANTITY,WR_ID,UPDATED_BY,PRODUCT_CD) VALUES ?";
        const values = wrId.map(id=> [name,price,category,quantity,id,adminId,productCd]);
        const [result] = await db.query(sql,[values]);

        res.status(200).json(successResponse(200,"Succesfully register!"));

    }catch (e) {
        logger.error(e);
        res.status(500).json(errorResponse(500, "Error"))
    }
})

router.post("/update" , async (req,res) => {
    try {
        const {requesterId,productId,name,price,category,quantity,registerId, wrId}  = req.body

        const product = await isProductExist(productId);

        if(!product) {
            res.status(404).json(errorResponse(404, "Product Not Found"))
        }

        const admin = await isUserAdmin(requesterId);
        if(!admin) {
            return res.status(403).json(errorResponse(403, "FORBIDDEN ACTION! PLEASE REPORT TO YOUR ADMIN!"))
        }

        const sql = "UPDATE TBL_ITEMS SET NAME = ? , PRICE = ? , QUANTITY = ? , CATEGORY = ?, WR_ID = ? , REGISTERED_BY = ? , UPDATED_BY = ? WHERE ID = ?";
        const values = [name, price, quantity,category, wrId, registerId, requesterId, productId]

        const [result] = await db.query(sql,values);
        res.status(201).json(successResponse(201,result))
    }catch (e) {
        logger.error(e)
        res.status(500).json(errorResponse(500, "error while updating data"))

    }
})





module.exports = router;