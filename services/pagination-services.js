
const db =require("../db")
const logger = require("../logger")
const {errorResponse} = require("../responseHelper")


async function getConsumerRequest(page,limit , status ="") {
    try{
        const offset = (page-1) *limit
        const sql = status ? `SELECT * FROM TBL_CONSUMER_REQUEST WHERE STATUS = ? LIMIT ? OFFSET ?` : `SELECT * FROM TBL_CONSUMER_REQUEST LIMIT ? OFFSET ?`
        const values = status ? [status, limit, offset] : [limit, offset];

        logger.info("--> status service <-- : " + status)
        logger.info("--> status values <-- : " + values)
        const [items] = await db.query(sql, values);

        //count data
        const countData = `SELECT COUNT (*) AS total FROM TBL_CONSUMER_REQUEST`;
        const [[{total}]] = await db.query(countData);

        const totalPages = Math.ceil(total/limit)

        return {
            status: 200,
            message: "Items retrieved successfully",
            data: items,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                limit: limit
            }
        };

    }catch (e) {
        logger.error(e)
        res.status(500).json(errorResponse(500, "Database Error"));
        throw e;
    }
}

module.exports = {getConsumerRequest}