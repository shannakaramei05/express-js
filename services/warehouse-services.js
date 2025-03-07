
const db = require('../db');


async function getWarehouseById (warehouseId) {
   try {
       const sql = warehouseId ? "SELECT * FROM TBL_WAREHOUSE WHERE id = ?" : "SELECT * FROM TBL_WAREHOUSE";
       const values = warehouseId ? [warehouseId] : []
       const [rows] = await db.query(sql, values);
       return rows.length > 1 ? rows : rows[0]
   }catch (e) {
       console.error('Error getting warehouse:', e);
       throw e;
   }
}


module.exports = {getWarehouseById}
