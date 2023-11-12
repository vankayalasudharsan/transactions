exports.success = (res, obj) => {
    const { statusCode, message, data } = obj;
    return res.status(statusCode).json({ status: true, message, data })
};

exports.error = (res, e) => {
    const { statusCode, message, errors } = e;
    return res.status(statusCode).json({ status: false, message, errors })
};