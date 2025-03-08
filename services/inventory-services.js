const db = require('../db')
const logger = require('../logger');


async function isProductExist(id) {
    try{
        const sql = "SELECT * FROM TBL_ITEMS WHERE id = ? ";
        const values = [id];

        const [result] = db.query(sql,values);

        return result.length !== 0;

    }   catch (e) {
        logger.error(e)
        throw e;
    }
}

async function createShipmentRequest(consumerRequestId){
    try{
        const [rows] = await db.query('SELECT * FROM TBL_CONSUMER_REQUEST WHERE id =  ?' , [consumerRequestId])
        return rows[0];
    }catch (e) {
        logger.error(e)
        throw e
    }
}


module.exports = {isProductExist, createShipmentRequest}