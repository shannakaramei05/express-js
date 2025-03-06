const successResponse = (statusCode,data=null) => {
    return {
        resCd : statusCode,
        status: "SUCCESS",
        content: data
    }
}


const errorResponse = (statusCode,data=null) => {
    return {
        resCd : statusCode,
        status: "ERROR",
        content: data
    }
}


module.exports = {successResponse, errorResponse}