
const express = require('express');
const logger = require('../logger')
const {errorResponse,successResponse} = require("../responseHelper")
const db = require('../db')

const {response} = require("express");


const router = express.Router();


router.get(["/", "/:id"] , async (req,res) => {
    try{
        const {id} = req.params;
        const sql = id ? "SELECT * FROM TBL_CONSUMERS WHERE id = ?" : "SELECT * FROM TBL_CONSUMERS";
        const values = id ? [id] : [];

        const [result] = await db.query(sql,values);
        logger.info(`${req.url} --- [RESULT] => ${JSON.stringify(result,null, 2)} `)

        res.status(200).json(successResponse(200, result.length === 1 ? result[0] : result));
    }catch (e) {
        logger.error(e);
        res.status(500).json(errorResponse(500, "ERROR WHEN EXECUTE DATABASE!"))
    }
})


router.post("/registers" , async (req,res) => {
    try {
        const {name, contact, address} = req.body;
        const sql = "INSERT INTO TBL_CONSUMERS (NAME, CONTACT, ADDRESS) VALUES (?,?,?)";
        const values = [name,contact, address]

        const [consumer] = await db.query(sql,values);
        res.status(200).json(successResponse(200, "Register successfully, wait untill user verify!"))

    }catch (e) {
        logger.error(e)
        res.status(500).body(errorResponse(500, "ERROR DATABASE"));
    }
})


router.post("/update", async (req,res) => {
    try {
        const {id,name, contact, address, compTy, isVerify} = req.body;

        const [currentConsumer] = await db.query("SELECT * FROM TBL_CONSUMERS WHERE id = ?",[id])

        if(currentConsumer.length === 0) {
            return res.status(404).json(errorResponse(404, "Consumer not found!"))
        }

        const sql = "UPDATE TBL_CONSUMERS SET name = ? , contact = ? , address = ? , comp_ty = ? , is_verify = ? WHERE id = ?";
        const values = [name, contact,address,compTy, isVerify, id];

        const [result] = await db.query(sql,values);

        res.status(201).json(successResponse(201, "successfully update!"))
    }catch (e) {
        logger.error(e);
        res.status(500).json(errorResponse(500, "ERROR DATABASE"))
    }
})


router.post("/create-request", async (req,res) => {
    const connection = await db.getConnection(); // Get a transaction-safe connection
    try{

        const {productCd,quantity, consumerId} = req.body;
        //checking user
        const [user] = await db.query("SELECT * FROM TBL_CONSUMERS WHERE id = ? ", [consumerId]);
        logger.info("test : " + user)

        if(user.length === 0) {
            return res.status(404).json(successResponse(404, "consumer not found"));
        }

        const requestItem = productCd.map((id, index) => [id, quantity[index], consumerId]);
        logger.info("--------> " + requestItem)

        // Begin transaction
        await connection.beginTransaction();

        const sql = `INSERT INTO TBL_CONSUMER_REQUEST (PRODUCT_CD, QUANTITY, REQUESTED_BY) VALUES ?`;
        const [result] = await db.query(sql,[requestItem])

        const consumerRequest = 'SELECT COUNT(*) AS count from TBL_CONSUMER_REQUEST WHERE REQUESTED_BY = ? AND STATUS = "PENDING"';

        const reqId = [consumerId];

        const [[{ count }]] = await db.query(consumerRequest, reqId);
        logger.info(count)
        // Commit transaction
        await connection.commit();
        res.status(200).json(successResponse(200,`succes create request [${count}]`))
    }catch (e) {
        await connection.rollback(); // Rollback everything if any error occurs
        logger.error(e)
        res.status(500).json(errorResponse(500,"Database Error"))
    }finally {
        connection.release(); // Ensure connection is released
    }
})


module.exports= router;