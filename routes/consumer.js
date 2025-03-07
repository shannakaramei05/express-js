
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


module.exports= router;